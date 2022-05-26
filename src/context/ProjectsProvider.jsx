import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import io from 'socket.io-client';

import { useAuth } from '../hooks/useAuth';
import { clientAxios } from '../config/clientAxios';
import config from '../config/config';

let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
	const [projects, setProjects] = useState([]);
	const [alert, setAlert] = useState({});
	const [project, setProject] = useState({});
	const [loading, setLoading] = useState(true);
	const [formModalTasks, setFormModalTasks] = useState(false);
	const [task, setTask] = useState({});
	const [collaborator, setCollaborator] = useState({});
	const [searcher, setSearcher] = useState(false);

	const { auth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const getProjects = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) return;
				const configHeader = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await clientAxios(`/projects`, configHeader);
				const orderedProjects = data.sort((a, b) => {
					return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
				});
				setProjects(orderedProjects);
				setAlert({});
			} catch (error) {
				setAlert({
					msg: 'No hay proyectos disponibles para mostrar',
					error: true,
				});
			}
		};

		getProjects();
	}, [auth]);

	useEffect(() => {
		socket = io(config.VITE_SERVER_IO);
	}, []);

	const showAlert = (alert) => {
		setAlert(alert);

		setTimeout(() => {
			setAlert({});
		}, 5000);
	};

	const submitProject = async (project) => {
		if (project.id) {
			await editProject(project);
		} else {
			await newProject(project);
		}
	};

	const editProject = async (project) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.put(`/projects/${project.id}`, project, configHeader);
			const projectsUpdated = projects.map((project) =>
				project._id === data._id ? data : project
			);
			const orderedProjects = projectsUpdated.sort((a, b) => {
				return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
			});
			setProjects(orderedProjects);
			navigate(`projects/${project.id}`);
		} catch (error) {
			setAlert({
				msg: 'Hubo un error al crear el proyecto. Intenta nuevamente por favor',
				error: true,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const newProject = async (project) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(`/projects`, project, configHeader);
			const projectsTemp = [...projects, data];
			const orderedProjects = projectsTemp.sort((a, b) => {
				return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
			});
			setProjects(orderedProjects);
			setAlert({
				msg: 'Proyecto creado correctamente',
				error: false,
			});
			setTimeout(() => {
				setAlert({});
				navigate(`/projects`);
			}, 3000);
		} catch (error) {
			setAlert({
				msg: 'Hubo un error al crear el proyecto. Intenta nuevamente por favor',
				error: true,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const getProject = async (id) => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios(`/projects/${id}`, configHeader);
			setProject(data);
			setAlert({});
		} catch (error) {
			navigate(`/projects`);
			setAlert({
				msg: error.response.data.msg,
				error: true,
			});
			setTimeout(() => {
				setAlert({});
			}, 3000);
		} finally {
			setLoading(false);
		}
	};

	const deleteProject = async (id) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			await clientAxios.delete(`/projects/${id}`, configHeader);
			const projectsTemp = projects.filter((project) => project._id !== id);
			const orderedProjects = projectsTemp.sort((a, b) => {
				return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
			});
			setProjects(orderedProjects);
			Swal.fire({
				icon: 'success',
				title: '¡Proyecto eliminado!',
				html: `<p>El proyecto fue <span class="font-bold">eliminado</span> correctamente.</p>`,
				reverseButtons: true,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_SUCCESS_COLOR,
				confirmButtonColor: config.VITE_SUCCESS_COLOR,
			});
			navigate(`/projects`);
		} catch (error) {
			Swal.fire({
				icon: 'warning',
				title: '¡Operación no realizada!',
				html: `<p>El proyecto <span class="font-bold"> no fue eliminado</span>. Intenta nuevamente.</p>`,
				reverseButtons: true,
				confirmButtonText: 'De acuerdo',
				confirmButtonColor: config.VITE_WARNING_COLOR,
				background: config.VITE_LIGHT_COLOR,
			});
		}
	};

	const handleFormModalTasks = () => {
		setTask({});
		setFormModalTasks(!formModalTasks);
	};

	const submitTask = async (task) => {
		if (task?.idTask) {
			await updateTask(task);
		} else {
			await createTask(task);
		}
	};

	const createTask = async (task) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(`/tasks`, task, configHeader);

			setAlert({});
			setFormModalTasks(false);

			// Socket.io
			socket.emit('new task', data.task);
		} catch (error) {
			setAlert({
				msg: 'Hubo un error al crear la tarea. Intenta nuevamente por favor',
				error: true,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const updateTask = async (task) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.put(`/tasks/${task.idTask}`, task, configHeader);

			// Socket.io
			socket.emit('update task', data.task);

			setAlert({});
			setFormModalTasks(false);
		} catch (error) {
			setAlert({
				msg: 'Hubo un error al actualizar la tarea. Intenta nuevamente por favor',
				error: true,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const handleModalUpdateTask = (task) => {
		setTask(task);
		setFormModalTasks(true);
	};

	const handleModalDeleteTask = (task) => {
		Swal.fire({
			icon: 'question',
			title: `¿Estás seguro de que deseas eliminar la tarea? 🤔`,
			html: `La tarea <span class="font-bold">"${task.taskname}"</span> será eliminada y no podrá recuperarse.`,
			confirmButtonText: 'Sí, elimínala',
			cancelButtonText: 'No, consérvala',
			showCancelButton: true,
			reverseButtons: true,
			confirmButtonColor: config.VITE_PRIMARY_COLOR,
			cancelButtonColor: config.VITE_DANGER_COLOR,
			iconColor: config.VITE_DANGER_COLOR,
			background: config.VITE_LIGHT_COLOR,
		}).then(async (result) => {
			if (result.value) {
				setTask(task);
				await deleteTask(task);
			}
		});
	};

	const deleteTask = async (task) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.delete(`/tasks/${task._id}`, configHeader);

			// Socket.io
			socket.emit('delete task', task);

			setAlert({});
			Swal.fire({
				icon: 'success',
				title: `${data.msg}`,
				html: `<p>La tarea fue <span class="font-bold">eliminada</span> correctamente.</p>`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_SUCCESS_COLOR,
				confirmButtonColor: config.VITE_SUCCESS_COLOR,
			});
			setTask({});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: '¡No se pudo eliminar la tarea!',
				html: `${error.response.data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_DANGER_COLOR,
				confirmButtonColor: config.VITE_DANGER_COLOR,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const submitCollaborator = async (email) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(
				`/projects/collaborators`,
				{ email },
				configHeader
			);

			setCollaborator(data);
			setAlert({});
		} catch (error) {
			setCollaborator({});
			Swal.fire({
				icon: 'error',
				title: '¡No se pudo encontrar al colaborador!',
				html: `${error.response.data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_DANGER_COLOR,
				confirmButtonColor: config.VITE_DANGER_COLOR,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const addCollaborator = async (email) => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(
				`/projects/collaborators/${project._id}`,
				{ email },
				configHeader
			);

			const updatedProject = { ...project };
			updatedProject.collaborators = [...project.collaborators, data.collaborator];
			setProject(updatedProject);
			setAlert({});
			setCollaborator({});
			Swal.fire({
				icon: 'success',
				title: `¡Colaborador agregado al proyecto ${project.projectname}!`,
				html: `${data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_SUCCESS_COLOR,
				confirmButtonColor: config.VITE_SUCCESS_COLOR,
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: '¡No se pudo agregar al colaborador!',
				html: `${error.response.data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_DANGER_COLOR,
				confirmButtonColor: config.VITE_DANGER_COLOR,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		} finally {
			setLoading(false);
		}
	};

	const deleteCollaborator = async (id) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(
				`/projects/collaborators-remove/${project._id}`,
				{ id },
				configHeader
			);

			if (data) {
				const updatedProject = { ...project };
				updatedProject.collaborators = project.collaborators.filter(
					(collaborator) => collaborator._id !== id
				);
				setProject(updatedProject);
			}
			setAlert({});
			setCollaborator({});
			Swal.fire({
				icon: 'success',
				title: `¡Colaborador eliminado del proyecto ${project.projectname}!`,
				html: `${data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_SUCCESS_COLOR,
				confirmButtonColor: config.VITE_SUCCESS_COLOR,
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: '¡No se pudo quitar al colaborador!',
				html: `${error.response.data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_DANGER_COLOR,
				confirmButtonColor: config.VITE_DANGER_COLOR,
			});
			setTimeout(() => {
				setAlert({});
			}, 4000);
		}
	};

	const changeTaskStatus = async (id) => {
		try {
			const token = localStorage.getItem('token');
			if (!token) return;

			const configHeader = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await clientAxios.post(`/tasks/status/${id}`, {}, configHeader);

			// Socket.io
			socket.emit('change status task', data.task);
			Swal.fire({
				icon: 'success',
				title: `¡La tarea ha cambiado de estado!`,
				html: `${data.msg}`,
				confirmButtonText: 'De acuerdo',
				background: config.VITE_LIGHT_COLOR,
				iconColor: config.VITE_SUCCESS_COLOR,
				confirmButtonColor: config.VITE_SUCCESS_COLOR,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearcher = () => {
		setSearcher(!searcher);
	};

	// Socket IO
	const submitProjectTask = (task) => {
		const tasksTemp = [...project.tasks, task];
		const orderedTasks = tasksTemp.sort((a, b) => {
			return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
		});
		const updatedProject = { ...project };
		updatedProject.tasks = [...orderedTasks];
		setProject(updatedProject);
	};

	const submitDeleteProjectTask = (deletedTask) => {
		const idTask = deletedTask._id;
		const tasksTemp = project.tasks.filter((task) => task._id !== idTask);
		const orderedTasks = tasksTemp.sort((a, b) => {
			return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
		});
		const updatedProject = { ...project };
		updatedProject.tasks = [...orderedTasks];
		setProject(updatedProject);
		setTask({});
	};

	const submitUpdateProjectTask = (updatedTask) => {
		const tasksTemp = project.tasks.map((task) => {
			if (task._id === updatedTask._id) {
				return updatedTask;
			}
			return task;
		});
		const orderedTasks = tasksTemp.sort((a, b) => {
			return new Date(a.dateToBeCompleted) - new Date(b.dateToBeCompleted);
		});
		const updatedProject = { ...project };
		updatedProject.tasks = [...orderedTasks];
		setProject(updatedProject);
		setTask({});
	};

	const submitChangeStatusProjectTask = (taskUpdated) => {
		const updatedProject = { ...project };
		updatedProject.tasks = project.tasks.map((task) => {
			if (task._id === taskUpdated._id) {
				task.status = taskUpdated.status;
				task.completedBy = taskUpdated.completedBy;
			}
			return task;
		});
		setProject(updatedProject);
		setTask({});
		setAlert({});
		setCollaborator({});
	};

	const logoutProjects = () => {
		setProjects([]);
		setProject({});
		setAlert({});
	};

	return (
		<ProjectsContext.Provider
			value={{
				projects,
				project,
				alert,
				showAlert,
				loading,
				formModalTasks,
				task,
				collaborator,
				searcher,
				submitProject,
				getProject,
				deleteProject,
				handleFormModalTasks,
				submitTask,
				handleModalDeleteTask,
				handleModalUpdateTask,
				deleteTask,
				submitCollaborator,
				addCollaborator,
				deleteCollaborator,
				changeTaskStatus,
				handleSearcher,
				submitProjectTask,
				submitDeleteProjectTask,
				submitUpdateProjectTask,
				submitChangeStatusProjectTask,
				logoutProjects,
			}}
		>
			{children}
		</ProjectsContext.Provider>
	);
};

export { ProjectsProvider };

export default ProjectsContext;
