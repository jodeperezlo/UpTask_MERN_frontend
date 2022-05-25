import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Alert } from './Alert';
import { useProjects } from '../hooks/useProjects';

export const FormProject = () => {
	const params = useParams();
	const [id, setId] = useState(null);
	const [projectname, setProjectname] = useState('');
	const [description, setDescription] = useState('');
	const [dateToBeCompleted, setDateToBeCompleted] = useState('');
	const [customer, setCustomer] = useState('');

	const { project, alert, showAlert, submitProject } = useProjects();

	useEffect(() => {
		if (params.id && Object.keys(project).length > 0) {
			const { projectname, description, dateToBeCompleted, customer } = project;
			setId(project._id);
			setProjectname(projectname);
			setDescription(description);
			setDateToBeCompleted(dateToBeCompleted.split('T')[0]);
			setCustomer(customer);
		}
	}, [params]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if ([projectname, description, dateToBeCompleted, customer].includes('')) {
			showAlert({
				msg: 'Llene todos los campos para poder guardar el proyecto',
				error: true,
			});
			return;
		}

		await submitProject({ id, projectname, description, dateToBeCompleted, customer });
		setId(null);
		setProjectname('');
		setDescription('');
		setDateToBeCompleted('');
		setCustomer('');
	};

	const { msg } = alert;

	return (
		<form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
			<div className='mb-5'>
				<label htmlFor='projectname' className='text-gray-700 font-bold text-sm'>
					Nombre del proyecto
				</label>
				<input
					id='projectname'
					type='text'
					className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
					placeholder='Escribe el nombre del proyecto'
					value={projectname}
					onChange={(e) => setProjectname(e.target.value)}
				/>
			</div>
			<div className='mb-5'>
				<label htmlFor='description' className='text-gray-700 font-bold text-sm'>
					Descripción del proyecto
				</label>
				<textarea
					id='description'
					className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md resize-none'
					placeholder='Escribe una descripción del proyecto'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<div className='mb-5'>
				<label htmlFor='dateToBeCompleted' className='text-gray-700 font-bold text-sm'>
					Fecha de entrega
				</label>
				<input
					id='dateToBeCompleted'
					type='date'
					className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
					placeholder='Fecha de entrega'
					value={dateToBeCompleted}
					onChange={(e) => setDateToBeCompleted(e.target.value)}
				/>
			</div>
			<div className='mb-5'>
				<label htmlFor='customer' className='text-gray-700 font-bold text-sm'>
					Nombre del cliente
				</label>
				<input
					id='customer'
					type='text'
					className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
					placeholder='Escribe el nombre del cliente'
					value={customer}
					onChange={(e) => setCustomer(e.target.value)}
				/>
			</div>

			<input
				type='submit'
				value={id ? 'Guarda los cambios' : 'Guarda el proyecto'}
				className='bg-sky-600 hover:bg-sky-700 w-full font-bold text-white py-2 px-4 rounded cursor-pointer transition-colors'
			/>

			{msg && <Alert alert={alert} />}
		</form>
	);
};
