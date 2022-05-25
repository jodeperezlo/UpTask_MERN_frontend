import React, { useState } from 'react';

import { useProjects } from '../hooks/useProjects';
import { Alert } from './Alert';

export const FormCollaborator = () => {
	const [email, setEmail] = useState('');

	const { alert, showAlert, submitCollaborator } = useProjects();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email.trim() === '') {
			showAlert({
				msg: 'El correo electrónico es obligatorio',
				error: true,
			});
			return;
		}

		await submitCollaborator(email);

		setEmail('');
	};

	const { msg } = alert;

	return (
		<form
			className='bg-white py-8 px-5 w-full md:w-2/3 rounded-md shadow'
			onSubmit={handleSubmit}
		>
			<div className='mb-4'>
				<label className='block text-sm font-semibold text-gray-700' htmlFor='date'>
					Email del colaborador
				</label>
				<input
					id='email'
					type='email'
					value={email}
					placeholder='Escribe el email del colaborador'
					onChange={(e) => setEmail(e.target.value)}
					onInput={() => showAlert({})}
					className='border-2 w-full  p-2 mt-2 placeholder-gray-400  rounded-md block  transition duration-150 ease-in-out'
				/>
			</div>

			{msg && <Alert alert={alert} />}

			<input
				type='submit'
				value='Busca al colaborador'
				className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded w-full text-md focus:outline-none focus:shadow-outline cursor-pointer transition-colors'
			/>
		</form>
	);
};
