import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
	const { auth } = useAuth();
	return (
		<>
			<aside className='md:w-1/3 lg:w-1/5 xl:1/6 px-5 py-10'>
				<p className='text-lg font-bold'>Hola: {auth.username}</p>

				<Link
					to='/projects/create-project'
					className='bg-sky-600 w-full p-2 text-white font-bold block mt-5 text-center rounded-md'
				>
					Crea un nuevo proyecto
				</Link>
			</aside>
		</>
	);
};
