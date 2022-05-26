import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/outline';

import { dateFormat } from '../helpers/dateFormat';
import { useAuth } from '../hooks/useAuth';

export const ProjectCard = ({ project }) => {
	const { _id, projectname, description, dateToBeCompleted, customer, createdAt, creator } =
		project;
	const { auth } = useAuth();

	return (
		<div className='w-full  mt-3 p-2'>
			<div className='border rounded border-gray-400 bg-white p-4 flex flex-col justify-between leading-normal hover:bg-slate-50 transition-all 0.3s ease-in-out'>
				<div className='mb-8'>
					<div className='flex flex-col md:flex-row justify-between items-center text-center'>
						<div className='flex flex-col md:flex-row mt-2 items-center text-center'>
							<CalendarIcon className='h-5 w-5 mr-2' />
							Fecha de entrega:
							<p className='text-gray-600'>
								<span className='ml-1 font-semibold'>{dateFormat(dateToBeCompleted)}</span>
							</p>
						</div>
						{auth._id !== creator && (
							<div className='flex flex-wrap mt-2 items-center bg-blue-200 py-1 px-5 rounded-full'>
								<UserGroupIcon className='h-5 w-5 mr-2' />
								<p>
									<span className='ml-1 font-semibold'>Colaborador</span>
								</p>
							</div>
						)}
					</div>
					<div className='text-gray-900 font-bold text-xl my-2'>{projectname}</div>
					<p className='text-gray-700 text-base'>{description}</p>
				</div>
				<div className='w-full'>
					<div className='text-md'>
						<p className='text-gray-700 leading-none'>
							Cliente: <span className='font-bold'>{customer}</span>
						</p>
						<div className='flex flex-col md:flex-row mt-5 items-center text-center'>
							<CalendarIcon className='h-5 w-5 mr-2' />
							Fecha de registro:
							<p className='text-gray-700'>
								<span className='ml-1 font-semibold'>{dateFormat(createdAt)}</span>
							</p>
						</div>
					</div>
				</div>

				<div className='flex items-center justify-center mt-3'>
					<Link
						to={`/projects/${_id}`}
						className='inline-block bg-sky-600 rounded-full px-3 py-2 text-sm font-semibold text-white my-2 hover:bg-sky-700 transition-all 0.3s ease-in-out'
					>
						Detalles del proyecto
					</Link>
				</div>
			</div>
		</div>
	);
};
