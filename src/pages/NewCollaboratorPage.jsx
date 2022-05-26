import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FormCollaborator } from '../components/FormCollaborator';
import { Loading } from '../components/Loading';
import { useProjects } from '../hooks/useProjects';

import { PlusCircleIcon } from '@heroicons/react/solid';
import { Alert } from '../components/Alert';

const NewCollaboratorPage = () => {
	const { id } = useParams();
	localStorage.setItem('lastPath', `/projects/collaborators-add/${id}`);

	const { project, loading, collaborator, getProject, alert, addCollaborator } = useProjects();

	useEffect(() => {
		getProject(id);
	}, []);

	if (!project?._id) return <Alert alert={alert} />;

	return (
		<>
			<h2 className='text-3xl font-black'>
				Agrega un nuevo colaborador al proyecto: {project.projectname}
			</h2>

			<div className='mt-8 flex justify-center'>
				<FormCollaborator />
			</div>

			{loading ? (
				<Loading msg={'Cargando... Espera un poco por favor. ⌚ '} />
			) : (
				collaborator?._id && (
					<div className='mt-8 flex justify-center'>
						<div className='bg-white py-8 px-5 w-full md:w-2/3 rounded-md shadow'>
							<h2 className='text-center mb-8 text-xl font-bold'>Resultado:</h2>

							<div className='flex flex-col xl:flex-row gap-2 justify-between items-center'>
								<p className='font-semibold text-lg mb-2 xl:mb-0'>{collaborator.username}</p>

								<button
									type='button'
									className='flex  items-center  bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-md focus:outline-none focus:shadow-outline cursor-pointer transition-colors'
									onClick={() => addCollaborator(collaborator.email)}
								>
									<PlusCircleIcon className='w-4 h-4 mr-2' />
									Agrégalo al proyecto
								</button>
							</div>
						</div>
					</div>
				)
			)}
		</>
	);
};

export default NewCollaboratorPage;
