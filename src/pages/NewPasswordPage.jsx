import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { clientAxios } from '../config/clientAxios';

const ForgotPasswordPage = () => {
	const { token } = useParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordModified, setPasswordModified] = useState(false);
	const [tokenValid, setTokenValid] = useState(false);
	const [alert, setAlert] = useState({});

	useEffect(() => {
		const validateToken = async () => {
			try {
				await clientAxios(`/users/forgot-password/${token}`);
				setTokenValid(true);
			} catch (err) {
				setAlert({
					msg: err.response.data.msg,
					error: true,
				});
			}
		};
		validateToken();
	}, []);

	const { msg } = alert;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.length < 6) {
			setAlert({
				msg: 'La contraseña debe de tener al menos 6 caracteres',
				error: true,
			});
			return;
		}
		if (password !== confirmPassword) {
			setAlert({
				msg: 'Las contraseñas no coinciden. Revisa los datos y vuelve a intentarlo',
				error: true,
			});
			return;
		}
		try {
			const { data } = await clientAxios.post(`/users/forgot-password/${token}`, {
				password,
			});
			setAlert({
				msg: data.msg,
				error: false,
			});
			setPasswordModified(true);
		} catch (err) {
			setAlert({
				msg: err.response.data.msg,
				error: true,
			});
		}
	};

	return (
		<>
			<h2 className='text-sky-600 font-black text-4xl capitalize'>
				Restablece tu contraseña para acceder a tus{' '}
				<span className='text-slate-700'>proyectos</span>
			</h2>

			{msg && <Alert alert={alert} />}

			{tokenValid && (
				<form
					className='my-5 bg-white shadow rounded-lg p-5'
					onSubmit={handleSubmit}
				>
					<div className='my-2'>
						<label
							htmlFor='password'
							className='text-gray-600 block text-lg font-semibold'
						>
							Nueva Contraseña
						</label>
						<input
							id='password'
							type='password'
							placeholder='Escribe tu nueva contraseña'
							className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className='my-2'>
						<label
							htmlFor='passwordConfirm'
							className='text-gray-600 block text-lg font-semibold'
						>
							Confirma tu nueva contraseña
						</label>
						<input
							id='passwordConfirm'
							type='password'
							placeholder='Escribe de nuevo tu contraseña'
							className='w-full m-3 p-3 border rounded-lg text-gray-700 bg-gray-50'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<input
						type='submit'
						className='bg-sky-700 w-full py-3 mb-4 text-white font-semibold rounded-lg hover:bg-sky-800 hover:cursor-pointer transition-colors duration-200'
						value='Cambia tu contraseña'
					/>
				</form>
			)}

			{passwordModified && (
				<Link to='/' className='block text-center mb-5 text-slate-500 text-lg'>
					Inicia sesión
				</Link>
			)}
		</>
	);
};

export default ForgotPasswordPage;
