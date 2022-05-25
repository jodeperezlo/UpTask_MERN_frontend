import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { clientAxios } from '../config/clientAxios';

const RegisterPage = () => {
	const [username, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [alert, setAlert] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if ([username, email, password, passwordConfirm].includes('')) {
			setAlert({
				error: true,
				msg: 'Todos los campos son obligatorios.',
			});
			return;
		}
		if (password !== passwordConfirm) {
			setAlert({
				error: true,
				msg: 'Las contraseñas no coinciden.',
			});
			return;
		}
		if (password.length < 6) {
			setAlert({
				error: true,
				msg: 'La contraseña debe de tener al menos 6 caracteres.',
			});
			return;
		}
		// Create user
		try {
			const { data } = await clientAxios.post(`/users`, {
				username,
				email,
				password,
			});
			setAlert({
				error: false,
				msg: data.msg,
			});
			setUserName('');
			setEmail('');
			setPassword('');
			setPasswordConfirm('');
		} catch (error) {
			setAlert({
				error: true,
				msg: error.response.data.msg,
			});
		}
	};

	const { msg } = alert;

	return (
		<>
			<h2 className='text-sky-600 font-black text-4xl capitalize'>
				Crea tu cuenta y administra tus{' '}
				<span className='text-slate-700'>proyectos</span>
			</h2>

			<form className='my-5 bg-white shadow rounded-lg p-5' onSubmit={handleSubmit}>
				<div className='my-2'>
					<label
						htmlFor='name'
						className='text-gray-600 block text-lg font-semibold'
					>
						Nombre completo
					</label>
					<input
						id='name'
						type='text'
						placeholder='Escribe tu nombre completo'
						className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={username}
						onChange={(e) => {
							setUserName(e.target.value);
							setAlert({});
						}}
					/>
				</div>
				<div className='my-2'>
					<label
						htmlFor='email'
						className='text-gray-600 block text-lg font-semibold'
					>
						Correo electrónico
					</label>
					<input
						id='email'
						type='email'
						placeholder='Escribe tu correo electrónico'
						className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setAlert({});
						}}
					/>
				</div>
				<div className='my-2'>
					<label
						htmlFor='password'
						className='text-gray-600 block text-lg font-semibold'
					>
						Contraseña
					</label>
					<input
						id='password'
						type='password'
						placeholder='Escribe tu contraseña'
						className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setAlert({});
						}}
					/>
				</div>
				<div className='my-2'>
					<label
						htmlFor='passwordConfirm'
						className='text-gray-600 block text-lg font-semibold'
					>
						Confirma tu contraseña
					</label>
					<input
						id='passwordConfirm'
						type='password'
						placeholder='Escribe de nuevo tu contraseña'
						className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
						value={passwordConfirm}
						onChange={(e) => {
							setPasswordConfirm(e.target.value);
							setAlert({});
						}}
					/>
				</div>

				<input
					type='submit'
					className='bg-sky-700 w-full py-3 mb-4 text-white font-semibold rounded-lg hover:bg-sky-800 hover:cursor-pointer transition-colors duration-200'
					value='Crea tu cuenta'
				/>

				{msg && <Alert alert={alert} />}
			</form>

			<nav className='lg:flex lg:justify-between'>
				<Link to='/' className='block text-center mb-5 text-slate-500 text-sm'>
					¿Ya tienes una cuenta? Inicia sesión
				</Link>
				<Link
					to='/forgot-password'
					className='block text-center mb-5 text-slate-500 text-sm'
				>
					¿Olvidaste tu contraseña? Recupérala aquí
				</Link>
			</nav>
		</>
	);
};

export default RegisterPage;
