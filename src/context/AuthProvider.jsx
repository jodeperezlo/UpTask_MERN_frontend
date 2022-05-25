import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { clientAxios } from '../config/clientAxios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const authUser = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setLoading(false);
				return;
			}
			const configRequest = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			try {
				const { data } = await clientAxios(`/users/profile`, configRequest);
				setAuth(data);
				const lastPath = localStorage.getItem('lastPath') || '/projects';
				navigate(lastPath);
			} catch (error) {
				setAuth({});
			} finally {
				setLoading(false);
			}
		};
		authUser();
	}, []);

	const logoutAuth = () => {
		setAuth({});
	};

	return (
		<AuthContext.Provider value={{ auth, loading, setAuth, logoutAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider };

export default AuthContext;
