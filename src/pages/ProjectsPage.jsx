import React from 'react';

import { Alert } from '../components/Alert';

import { ProjectCard } from '../components/ProjectCard';

import { useProjects } from '../hooks/useProjects';

const ProjectsPage = () => {
	localStorage.setItem('lastPath', '/projects');
	const { projects, alert } = useProjects();

	const { msg } = alert;

	return (
		<div>
			<h1 className='text-2xl font-black'>Proyectos</h1>

			{msg && <Alert alert={alert} />}

			<div className='bg-white shadow mt-10 rounded-sm flex flex-col justify-center items-center'>
				{projects.length > 0 ? (
					projects.map((project) => <ProjectCard key={project._id} project={project} />)
				) : (
					<p className='p-5 text-center text-gray-600'>No hay proyectos aún</p>
				)}
			</div>
		</div>
	);
};

export default ProjectsPage;
