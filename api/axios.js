//frontend/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backend-vandal.vercel.app:3000/api', // Substitua pelo endereço do seu backend
});

export default instance;