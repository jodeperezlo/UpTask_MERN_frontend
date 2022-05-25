import React from 'react';
import Swal from 'sweetalert2';

import { DocumentTextIcon, XCircleIcon } from '@heroicons/react/outline';

import { useProjects } from '../hooks/useProjects';
import { dateFormat } from '../helpers/dateFormat';
import config from '../config/config';
import { useAdmin } from '../hooks/useAdmin';

export const TaskCard = ({ task }) => {
	const admin = useAdmin();
	const { handleModalUpdateTask, changeTaskStatus, handleModalDeleteTask } = useProjects();
	const { _id, taskname, description, status, priority, date, completedBy } = task;

	return (
		<div className='border-b p-5 sm:flex sm:justify-between items-center'>
			<div className='flex flex-col items-start'>
				<p className='font-bold text-lg'>{taskname}</p>
				<p className='text-md'>{description}</p>
				<p className='text-md'>{dateFormat(date)}</p>
				<div className='flex gap-2 mt-3'>
					<p className='font-bold'>
						Prioridad:{' '}
						<span
							className={`font-semibold text-md px-7 py-1 rounded-full ${
								priority === 'Baja'
									? 'bg-gray-400'
									: priority === 'Media'
									? 'bg-blue-400'
									: 'bg-red-400'
							}`}
						>
							{priority}
						</span>
					</p>
				</div>
				{status && (
					<p className='text-sm bg-amber-300 p-1 rounded-md text-slate-900 font-semibold mt-4'>
						Tarea completada por: {completedBy.username}
					</p>
				)}
			</div>

			<div className='flex flex-col lg:flex-row gap-2 mt-4'>
				<button
					className={`flex gap-2 items-center w-auto justify-center ${
						status ? 'bg-green-600' : 'bg-yellow-600'
					} px-4 py-3 text-white font-bold text-sm rounded-md ${
						status ? 'hover:bg-green-800' : 'hover:bg-yellow-800'
					} hover:cursor-pointer transition-colors duration-200`}
					onClick={() => changeTaskStatus(_id)}
				>
					{status ? 'Completada' : 'Pendiente'}
				</button>

				{admin && (
					<>
						<button
							onClick={() => handleModalUpdateTask(task)}
							className='flex gap-2 items-center w-auto justify-center bg-slate-600 px-4 py-2 text-white font-bold text-sm rounded-md hover:bg-slate-800 hover:cursor-pointer transition-colors duration-200'
						>
							Edita la tarea
							<DocumentTextIcon className='h-5 w-5' />
						</button>

						<button
							onClick={() => handleModalDeleteTask(task)}
							className='flex gap-2 items-center w-auto justify-center bg-red-600 px-4 py-2 text-white font-bold text-sm rounded-md hover:bg-red-800 hover:cursor-pointer transition-colors duration-200'
						>
							Elimina la tarea
							<XCircleIcon className='h-5 w-5' />
						</button>
					</>
				)}
			</div>
		</div>
	);
};
