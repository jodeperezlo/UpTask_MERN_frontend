import React from 'react';

export const Pulse = () => {
	return (
		<div className='border border-gray-300 shadow rounded-md p-4 w-full mx-auto'>
			<div className='animate-pulse flex space-x-4'>
				<div className='flex-1 space-y-4 py-1'>
					<div className='bg-gray-400 h-8 w-1/4'></div>
					<div className='bg-gray-400 h-5 w-1/5'></div>
					<div className='space-y-2'>
						<div className='bg-gray-400 h-4 rounded w-1/3'></div>
						<div className='bg-gray-400 h-4 rounded w-4/5'></div>
						<div className='bg-gray-400 h-4 rounded w-3/4'></div>
						<div className='bg-gray-400 h-4 rounded w-5/6'></div>
						<div className='bg-gray-400 h-4 rounded w-3/4'></div>
					</div>
				</div>
			</div>
		</div>
	);
};
