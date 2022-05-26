import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { useProjects } from '../hooks/useProjects';
import { Search } from './Search';

export const Header = () => {
	const { handleSearcher, logoutProjects } = useProjects();
	const { logoutAuth } = useAuth();

	const handleLogout = () => {
		logoutAuth();
		logoutProjects();
		localStorage.removeItem('token');
	};

	return (
		<>
			<header className='px-4 py-5 bg-white border-b'>
				<div className='md:flex md:justify-between'>
					<h2 className='text-2xl text-sky-600 font-black text-center mb-5 md:mb-0'>UpTask</h2>

					<div className='flex flex-col md:flex-row items-center gap-4'>
						<button onClick={handleSearcher} type='button' className='font-bold'>
							Busca un proyecto
						</button>
						<Link to='/projects' className='font-bold'>
							Mis proyectos
						</Link>
						<button
							onClick={handleLogout}
							type='button'
							className='text-white text-sm bg-sky-600 p-3 rounded-md font-bold hover:bg-sky-700 transition-all 0.3s ease-in-out'
						>
							Cerrar sesión
						</button>

						<Search />
					</div>
				</div>
			</header>
		</>
	);
};
