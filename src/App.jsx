import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { ProjectsProvider } from './context/ProjectsProvider';

import AuthLayout from './layouts/AuthLayout';
import ConfirmAccountPage from './pages/ConfirmAccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import NewPasswordPage from './pages/NewPasswordPage';
import RegisterPage from './pages/RegisterPage';
import ProjectPage from './pages/ProjectPage';

import PrivateRoute from './layouts/PrivateRoute';
import ProjectsPage from './pages/ProjectsPage';
import NewProjectPage from './pages/NewProjectPage';
import EditProjectPage from './pages/EditProjectPage';
import NewCollaboratorPage from './pages/NewCollaboratorPage';

const App = () => {
	return (
		<BrowserRouter>
			<AuthProvider>
				<ProjectsProvider>
					<Routes>
						<Route path='/' element={<AuthLayout />}>
							<Route index element={<LoginPage />} />
							<Route path='register' element={<RegisterPage />} />
							<Route path='forgot-password' element={<ForgotPasswordPage />} />
							<Route path='forgot-password/:token' element={<NewPasswordPage />} />
							<Route path='confirm-account/:id' element={<ConfirmAccountPage />} />
						</Route>
						<Route path='/projects' element={<PrivateRoute />}>
							<Route index element={<ProjectsPage />} />
							<Route path='create-project' element={<NewProjectPage />} />
							<Route path='collaborators-add/:id' element={<NewCollaboratorPage />} />
							<Route path=':id' element={<ProjectPage />} />
							<Route path='edit/:id' element={<EditProjectPage />} />
						</Route>
					</Routes>
				</ProjectsProvider>
			</AuthProvider>
		</BrowserRouter>
	);
};

export default App;
