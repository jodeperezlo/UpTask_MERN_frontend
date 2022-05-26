import React from 'react';

export const Loading = ({ msg = 'Cargando...' }) => {
	return (
		<div className='bg-gray-100 rounded-lg shadow-lg p-4 flex justify-center items-center'>
			<img
				src='https://raw.githubusercontent.com/jodeperezlo/UPTask_MERN_backend/master/assets/img/uptask.png'
				alt='UpTask'
				className='w-10 animate-bounce'
			/>
			<h1 className='text-center text-xl font-bold block'>{msg}</h1>
		</div>
	);
};
