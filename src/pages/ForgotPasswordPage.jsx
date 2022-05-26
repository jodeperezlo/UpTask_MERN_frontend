import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { clientAxios } from '../config/clientAxios';

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState('');
	const [alert, setAlert] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email === '') {
			setAlert({
				msg: 'Por favor ingresa tu correo electrónico',
				error: true,
			});
		}
		try {
			const { data } = await clientAxios.post(`/users/forgot-password`, {
				email,
			});
			setAlert({
				msg: data.msg,
				error: false,
			});
		} catch (err) {
			setAlert({
				msg: err.response.data.msg,
				error: true,
			});
		}
	};

	const { msg } = alert;

	return (
		<>
			<h2 className='text-sky-600 font-black text-4xl capitalize text-center md:text-left'>
				Recupera tu acceso y no pierdas tus <span className='text-slate-700'>proyectos</span>
			</h2>

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

				<input
					type='submit'
					className='bg-sky-700 w-full py-3 mb-4 text-white font-semibold rounded-lg hover:bg-sky-800 hover:cursor-pointer transition-colors duration-200'
					value='Recupera tu cuenta'
				/>

				{msg && <Alert alert={alert} />}
			</form>

			<nav className='lg:flex lg:justify-between'>
				<Link to='/register' className='block text-center mb-5 text-slate-500 text-sm'>
					¿No tienes una cuenta? Regístrate gratis
				</Link>
				<Link to='/' className='block text-center mb-5 text-slate-500 text-sm'>
					¿Ya tienes una cuenta? Inicia sesión
				</Link>
			</nav>
		</>
	);
};

export default ForgotPasswordPage;
