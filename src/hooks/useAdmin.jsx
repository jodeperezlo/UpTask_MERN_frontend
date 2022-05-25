import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';

export const useAdmin = () => {
	const { auth } = useAuth();
	const { project } = useProjects();

	return project.creator === auth._id;
};
