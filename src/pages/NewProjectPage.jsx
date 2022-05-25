import React from 'react';

import { FormProject } from '../components/FormProject';

const NewProjectPage = () => {
	return (
		<div>
			<h1 className='text-2xl font-black'>Nuevo proyecto</h1>

			<div className='mt-5 flex justify-center'>
				<FormProject />
			</div>
		</div>
	);
};

export default NewProjectPage;
