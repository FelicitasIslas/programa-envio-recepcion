import axios from 'axios';

const API = axios.create({
  baseURL: 'https://programa-envio-recepcion-backend.onrender.com/api'
});

export default API;