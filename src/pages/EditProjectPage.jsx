import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

import { TrashIcon } from '@heroicons/react/outline';

import { FormProject } from '../components/FormProject';
import { Pulse } from '../components/Pulse';

import { useProjects } from '../hooks/useProjects';
import config from '../config/config';

const EditProjectPage = () => {
	const { id } = useParams();
	localStorage.setItem('lastPath', `/projects/edit/${id}`);

	const { project, loading, getProject, deleteProject } = useProjects();

	const { projectname } = project;

	useEffect(() => {
		getProject(id);
	}, []);

	const handleDelete = () => {
		Swal.fire({
			icon: 'question',
			title: '¿Estás seguro de que deseas eliminar el proyecto? 🤔',
			html: `<p>Estás a punto de eliminar el proyecto <span class="font-bold">"${projectname}"</span>.</p><p>Una vez eliminado el proyecto no podrá recuperarse.</p>`,
			confirmButtonText: 'Sí, elimínalo',
			cancelButtonText: 'No, consérvalo',
			showCancelButton: true,
			reverseButtons: true,
			confirmButtonColor: config.VITE_PRIMARY_COLOR,
			cancelButtonColor: config.VITE_DANGER_COLOR,
			background: config.VITE_LIGHT_COLOR,
			iconColor: config.VITE_DANGER_COLOR,
		}).then((result) => {
			if (result.isConfirmed) {
				deleteProject(id);
			}
		});
	};

	if (loading) return <Pulse />;

	return (
		<>
			<div className='flex justify-between'>
				<h2 className='font-semibold text-3xl'>
					Edita el proyecto: <span className='font-black'>{projectname}</span>
				</h2>
				<button
					onClick={handleDelete}
					className='font-bold flex items-center text-gray-400 hover:text-red-600 transition-all ease-in'
				>
					<TrashIcon className='h-6 w-6' />
					Elimina el proyecto
				</button>
			</div>

			<div className='mt-5 flex justify-center'>
				<FormProject />
			</div>
		</>
	);
};

export default EditProjectPage;
