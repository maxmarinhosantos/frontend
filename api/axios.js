//frontend/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://198.27.114.56:3000/api', // Substitua pelo endereço do seu backend
});

export default instance;