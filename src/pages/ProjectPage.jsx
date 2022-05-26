import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PencilAltIcon, UserAddIcon } from '@heroicons/react/outline';
import { PlusCircleIcon } from '@heroicons/react/solid';
import io from 'socket.io-client';

import { Pulse } from '../components/Pulse';
import { FormModalTasks } from '../components/FormModalTasks';
import { useProjects } from '../hooks/useProjects';
import { useAdmin } from '../hooks/useAdmin';
import { Alert } from '../components/Alert';
import { TaskCard } from '../components/TaskCard';
import { CollaboratorCard } from '../components/CollaboratorCard';
import config from '../config/config';

let socket;

const ProjectPage = () => {
	const { id } = useParams();
	localStorage.setItem('lastPath', `/projects/${id}`);

	const admin = useAdmin();
	const {
		getProject,
		project,
		loading,
		handleFormModalTasks,
		submitProjectTask,
		submitDeleteProjectTask,
		submitUpdateProjectTask,
		submitChangeStatusProjectTask,
	} = useProjects();
	const { projectname } = project;

	useEffect(() => {
		getProject(id);
	}, []);

	useEffect(() => {
		socket = io(config.VITE_SERVER_IO);
		socket.emit('open project', id);
	}, []);

	useEffect(() => {
		socket.on('task added', (newTask) => {
			if (newTask.project === project._id) {
				submitProjectTask(newTask);
			}
		});

		socket.on('task deleted', (deletedTask) => {
			if (deletedTask.project === project._id) {
				submitDeleteProjectTask(deletedTask);
			}
		});

		socket.on('task updated', (updatedTask) => {
			if (updatedTask.project._id === project._id) {
				submitUpdateProjectTask(updatedTask);
			}
		});

		socket.on('status task changed', (updatedTask) => {
			if (updatedTask.project._id === project._id) {
				submitChangeStatusProjectTask(updatedTask);
			}
		});
	});

	return (
		<>
			<div className='lg:flex justify-between'>
				<h2 className='font-black text-3xl'>{projectname}</h2>

				{admin && (
					<div className='flex items-center gap-2 text-gray-400 hover:text-black transition-all ease-in font-bold mt-4 lg:mt-0'>
						<PencilAltIcon className='h-4 w-4' />
						<Link to={`/projects/edit/${id}`}>Edita el proyecto</Link>
					</div>
				)}
			</div>

			{loading && (
				<>
					<Pulse />
					<Pulse />
					<Pulse />
				</>
			)}

			{admin && (
				<>
					<button
						type='button'
						className='text-sm px-5 py-2 mt-5 w-full sm:w-auto rounded-md font-bold bg-sky-400 text-white text-center hover:bg-sky-500 transition-all ease-in flex items-center justify-center gap-2'
						onClick={handleFormModalTasks}
					>
						<PlusCircleIcon className='h-5 w-5' />
						Nueva tarea
					</button>
				</>
			)}

			<p className='font-bold text-xl mt-8'>Tareas del proyecto</p>

			<div className='bg-white shadow mt-8 rounded-md'>
				{project.tasks?.length ? (
					project.tasks?.map((task) => <TaskCard key={task._id} task={task} />)
				) : (
					<Alert
						alert={{
							msg: 'Aún no agregas tareas a este proyecto, comienza a agregar tus tareas para adminisitrar tu proyecto.',
							error: false,
						}}
					/>
				)}
			</div>

			{admin && (
				<>
					<div className='lg:flex items-center justify-between mt-8'>
						<p className='font-bold text-xl mt-8'>Colaboradores del proyecto</p>
						<div className='flex items-center gap-2 text-gray-400 hover:text-black transition-all ease-in font-bold mt-4 lg:mt-0'>
							<UserAddIcon className='h-4 w-4' />
							<Link to={`/projects/collaborators-add/${id}`}>Agrega un nuevo colaborador</Link>
						</div>
					</div>

					<div className='bg-white shadow mt-8 rounded-md'>
						{project.collaborators?.length ? (
							project.collaborators?.map((collaborator) => (
								<CollaboratorCard key={collaborator._id} collaborator={collaborator} />
							))
						) : (
							<Alert
								alert={{
									msg: 'Aún no agregas colaboradores a este proyecto, comienza a agregar nuevos colaboradores para este proyecto.',
									error: false,
								}}
							/>
						)}
					</div>
				</>
			)}

			<FormModalTasks />
		</>
	);
};

export default ProjectPage;
