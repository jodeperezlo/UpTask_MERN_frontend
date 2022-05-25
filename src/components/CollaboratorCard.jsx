import React from 'react';
import Swal from 'sweetalert2';
import { XCircleIcon } from '@heroicons/react/outline';

import { useProjects } from '../hooks/useProjects';
import config from '../config/config';

export const CollaboratorCard = ({ collaborator }) => {
	const { username, email, _id } = collaborator;
	const { deleteCollaborator } = useProjects();

	const handleDeleteCollaborator = async () => {
		Swal.fire({
			icon: 'question',
			title: `¿Estás seguro de que deseas quitar al colaborador? 🤔`,
			html: `El colaborador <span class="font-bold">"${username}"</span> será eliminado del proyecto y tendrás que volver a agregarlo de manera manual para que pueda volver a trabajar en este proyecto.`,
			confirmButtonText: 'Sí, elimínalo',
			cancelButtonText: 'No, consérvalo',
			showCancelButton: true,
			reverseButtons: true,
			confirmButtonColor: config.VITE_PRIMARY_COLOR,
			cancelButtonColor: config.VITE_DANGER_COLOR,
			iconColor: config.VITE_DANGER_COLOR,
			background: config.VITE_LIGHT_COLOR,
		}).then(async (result) => {
			if (result.value) {
				await deleteCollaborator(_id);
			}
		});
	};

	return (
		<div className='border-b p-5 flex flex-col sm:flex-row sm:justify-between gap-2 items-center'>
			<div>
				<p className='font-semibold'>{username}</p>
				<p className='text-sm text-gray-700'>{email}</p>
			</div>

			<div>
				<button
					onClick={handleDeleteCollaborator}
					className='flex gap-2 items-center bg-red-600 px-4 py-2 text-white font-bold text-sm rounded-md hover:bg-red-800 hover:cursor-pointer transition-colors duration-200'
				>
					Quita al colaborador
					<XCircleIcon className='h-5 w-5' />
				</button>
			</div>
		</div>
	);
};
