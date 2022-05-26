import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { clientAxios } from '../config/clientAxios';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [alert, setAlert] = useState({});
	const navigate = useNavigate();

	const { setAuth } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if ([email, password].includes('')) {
			setAlert({
				msg: 'Por favor ingresa tu correo electrónico y contraseña.',
				error: true,
			});
			return;
		}

		try {
			const { data } = await clientAxios.post('/users/login', { email, password });
			setAlert({});
			localStorage.setItem('token', data.token);
			setAuth(data);
			navigate('/projects', { replace: true });
		} catch (error) {
			setAlert({
				msg: error.response.data.msg,
				error: true,
			});
		}
	};

	const { msg } = alert;

	return (
		<>
			<h2 className='text-sky-600 font-black text-4xl capitalize text-center md:text-left'>
				Inicia sesión y administra tus <span className='text-slate-700'>proyectos</span>
			</h2>

			{msg && <Alert alert={alert} />}

			<form className='my-5 bg-white shadow rounded-lg p-5' onSubmit={handleSubmit}>
				<div className='my-2'>
					<label htmlFor='email' className='text-gray-600 block text-lg font-semibold'>
						Correo electrónico
					</label>
					<input
						id='email'
						type='email'
						placeholder='Escribe tu correo electrónico'
						className='w-full my-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className='my-2'>
					<label htmlFor='password' className='text-gray-600 block text-lg font-semibold'>
						Contraseña
					</label>
					<input
						id='password'
						type='password'
						placeholder='Escribe tu contraseña'
						className='w-full my-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<input
					type='submit'
					className='bg-sky-700 w-full py-3 mb-4 text-white font-semibold rounded-lg hover:bg-sky-800 hover:cursor-pointer transition-colors duration-200'
					value='Inicia sesión'
				/>
			</form>

			<nav className='lg:flex lg:justify-between'>
				<Link to='/register' className='block text-center mb-5 text-slate-500 text-sm'>
					¿No tienes una cuenta? Regístrate gratis
				</Link>
				<Link to='/forgot-password' className='block text-center mb-5 text-slate-500 text-sm'>
					¿Olvidaste tu contraseña? Recupérala aquí
				</Link>
			</nav>
		</>
	);
};

export default LoginPage;
