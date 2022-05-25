import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/outline';

import { Alert } from './Alert';
import { useProjects } from '../hooks/useProjects';

const PRIORITY = ['Baja', 'Media', 'Alta'];

export const FormModalTasks = () => {
	const { id } = useParams();

	const [idTask, setIdTask] = useState('');
	const [taskname, setTaskname] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [priority, setPriority] = useState('');

	const { alert, showAlert, formModalTasks, task, handleFormModalTasks, submitTask } =
		useProjects();

	useEffect(() => {
		if (task?._id) {
			setIdTask(task._id);
			setTaskname(task.taskname);
			setDescription(task.description);
			setDate(task.date?.split('T')[0]);
			setPriority(task.priority);
		} else {
			setIdTask('');
			setTaskname('');
			setDescription('');
			setDate('');
			setPriority('');
		}
	}, [task]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if ([taskname, description, priority, date].includes('')) {
			showAlert({
				msg: 'Llene todos los campos para poder guardar la tarea',
				error: true,
			});
			return;
		}

		await submitTask({ idTask, taskname, description, priority, project: id, date });

		setIdTask('');
		setTaskname('');
		setDescription('');
		setPriority('');
		setDate('');
	};

	const { msg } = alert;

	return (
		<Transition.Root show={formModalTasks} as={Fragment}>
			<Dialog
				as='div'
				className='fixed z-10 inset-0 overflow-y-auto'
				onClose={handleFormModalTasks}
			>
				<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className='hidden sm:inline-block sm:align-middle sm:h-screen'
						aria-hidden='true'
					>
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
							<div className='hidden sm:block absolute top-0 right-0 pt-4 pr-4'>
								<button
									type='button'
									className='bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-200'
									onClick={handleFormModalTasks}
								>
									<span className='sr-only'>Cerrar</span>
									<XCircleIcon className='h-6 w-6' />
								</button>
							</div>
							<div className='sm:flex sm:items-start'>
								<div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
									<Dialog.Title as='h3' className='text-2xl leading-6 font-bold text-gray-900'>
										{idTask ? 'Edita la tarea' : 'Crea una nueva tarea'}
									</Dialog.Title>

									{msg && <Alert alert={alert} />}

									<form className='my-8' onSubmit={handleSubmit}>
										<div className='mb-4'>
											<label
												className='block text-sm font-semibold text-gray-700'
												htmlFor='taskname'
											>
												Nombre de la tarea
											</label>
											<input
												id='taskname'
												type='text'
												value={taskname}
												placeholder='Escribe el nombre de la tarea'
												onChange={(e) => setTaskname(e.target.value)}
												className='border-2 w-full  p-2 mt-2 placeholder-gray-400  rounded-md block  transition duration-150 ease-in-out'
											/>
										</div>
										<div className='mb-4'>
											<label
												className='block text-sm font-semibold text-gray-700'
												htmlFor='description'
											>
												Descripción de la tarea
											</label>
											<textarea
												id='description'
												value={description}
												placeholder='Escribe una breve descripción de la tarea'
												onChange={(e) => setDescription(e.target.value)}
												className='resize-none border-2 w-full  p-2 mt-2 placeholder-gray-400  rounded-md block  transition duration-150 ease-in-out'
											/>
										</div>
										<div className='mb-4'>
											<label
												className='block text-sm font-semibold text-gray-700'
												htmlFor='date'
											>
												Fecha de entrega
											</label>
											<input
												id='date'
												type='date'
												value={date}
												onChange={(e) => setDate(e.target.value)}
												className='border-2 w-full  p-2 mt-2 placeholder-gray-400  rounded-md block  transition duration-150 ease-in-out'
											/>
										</div>
										<div className='mb-4'>
											<label
												className='block text-sm font-semibold text-gray-700'
												htmlFor='priority'
											>
												Prioridad de la tarea
											</label>
											<select
												id='priority'
												value={priority}
												onChange={(e) => setPriority(e.target.value)}
												className={`border-2 w-full  p-2 mt-2  rounded-md transition duration-150 ease-in-out ${
													priority === '--- Selecciona la prioridad ---' && 'text-gray-400'
												}`}
											>
												<option className='text-gray-400'>
													--- Selecciona la prioridad ---
												</option>
												{PRIORITY.map((option) => (
													<option key={option} className='text-gray-900'>
														{option}
													</option>
												))}
											</select>
										</div>

										<input
											type='submit'
											value={idTask ? 'Guarda los cambios' : 'Guarda la nueva tarea'}
											className='bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded w-full text-md focus:outline-none focus:shadow-outline cursor-pointer transition-colors'
										/>
									</form>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};
