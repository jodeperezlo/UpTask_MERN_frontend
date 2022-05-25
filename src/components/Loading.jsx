import React from 'react';

export const Loading = ({ msg = 'Cargando...' }) => {
	return (
		<div className='bg-gray-100 rounded-lg shadow-lg p-4 flex justify-center items-center h-screen'>
			<img
				src='https://s3.us-west-2.amazonaws.com/secure.notion-static.com/73c3c356-39fb-4f0e-8140-7267efcb95b8/logo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220418%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220418T151821Z&X-Amz-Expires=86400&X-Amz-Signature=20ad2938b169981b31cf53746a715b1189e9dd605cf04b891a75b875947f05d1&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D"logo.png"&x-id=GetObject'
				alt='UpTask'
				className='w-20 animate-spin'
			/>
			<h1 className='text-center text-xl font-bold block'>{msg}</h1>
		</div>
	);
};
