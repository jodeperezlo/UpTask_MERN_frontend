import Axios from 'axios';
import config from './config';

export const clientAxios = Axios.create({
	baseURL: config.VITE_BACKEND_URL,
});
