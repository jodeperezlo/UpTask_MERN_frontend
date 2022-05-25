import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Alert } from '../components/Alert';
import { clientAxios } from '../config/clientAxios';

const ConfirmAccountPage = () => {
	const params = useParams();
	const { id } = params;
	const [alert, setAlert] = useState({});
	const [confirmedAccount, setConfirmedAccount] = useState(false);

	useEffect(() => {
		const confirmAccount = async () => {
			try {
				const { data } = await clientAxios(`/users/confirm-account/${id}`);
				setAlert({
					msg: data.msg,
					error: false,
				});
				setConfirmedAccount(true);
			} catch (error) {
				setAlert({
					msg: error.response.data.msg,
					error: true,
				});
			}
		};
		confirmAccount();
	}, []);

	const { msg } = alert;

	return (
		<>
			<h2 className='text-sky-600 font-black text-4xl capitalize'>
				Confirma tu cuenta y comienza a crear a tus{' '}
				<span className='text-slate-700'>proyectos</span>
			</h2>

			<div className='mt-5 md:mt-10 shadow-md px-3 py-5 rounded-md bg-white'>
				{msg && <Alert alert={alert} />}
				{confirmedAccount && (
					<Link to='/' className='block text-center mb-5 text-slate-500 text-lg'>
						Inicia sesión
					</Link>
				)}
			</div>
		</>
	);
};

export default ConfirmAccountPage;
