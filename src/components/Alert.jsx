import React from 'react';
import PropTypes from 'prop-types';

export const Alert = ({ alert }) => {
	return (
		<div
			className={`${
				alert.error ? 'from-red-500 to-red-600' : 'from-sky-500 to-sky-600'
			} bg-gradient-to-br text-center p-3 rounded-sm  text-white font-semibold text-sm my-5`}
		>
			{alert.msg}
		</div>
	);
};

Alert.propTypes = {
	alert: PropTypes.object.isRequired,
};
