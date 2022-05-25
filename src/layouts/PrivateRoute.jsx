import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { Loading } from '../components/Loading';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
	const { auth, loading } = useAuth();
	if (loading)
		return <Loading msg={'Comprobando la información, espera un momento por favor.'} />;
	return (
		<>
			{auth._id ? (
				<div className='bg-gray-100'>
					<Header />
					<div className='md:flex md:min-h-screen'>
						<Sidebar />
						<main className='flex-1 p-10'>
							<Outlet />
						</main>
					</div>
				</div>
			) : (
				<Navigate to='/' />
			)}
		</>
	);
};

export default PrivateRoute;
