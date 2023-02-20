import axios from 'axios';
import router from '@/router';
import { Message } from 'element-ui';
import { getToken, setToken } from '@/utils/auth';

// Create axios instance
const service = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
  // baseURL: 'http://127.0.0.1:5000/api',
  timeout: 0, // Request timeout
});

// Request intercepter
service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // Set JWT token
    }

    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    console.log('error con el token'); // for debug
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  response => {
    if (response.headers.authorization) {
      setToken(response.headers.authorization);
      response.data.token = response.headers.authorization;
    }

    return response.data;
  },
  (error) => {
    let message = 'Ha fallado la petición al servidor, intente nuevamente.';

    if (error.response.status === 401) {
      let mensaje = 'Su sesión ha expirado... por favor, vuelva a iniciar sesión para continuar.';
      if (error.response.data.error) {
        mensaje = error.response.data.error;
      }
      Message({
        message: mensaje,
        type: 'error',
        duration: 5 * 1000,
      });
      router.push('/login');
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      Message({
        message: 'Ha expirado el tiempo de su sesion, debe autenticarse nuevamente.',
        type: 'warning',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }

    if (error.response.status === 422) { // validaciones
      if (error.response.data.data && error.response.data.data.validation) {
        const mensajes = [];
        for (const mensaje of error.response.data.data.validation) {
          mensajes.push(mensaje);
        }
        Message({
          message: mensajes[0],
          type: 'error',
          duration: 5 * 1000,
        });

        return Promise.reject(error);
      }
      let message = 'Compruebe los datos';
      if (error.response.data && error.response.data.error) {
        message = error.response.data.error;
      }
      //
      // if (error.response.data && error.response.data.data.errores) {
      //   message = error.response.data.data.errores;
      // }
      Message({
        message: message,
        type: 'warning',
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }

    if (error.response.data.success === false) {
      message = error.response.data.msg; // en caso de que ocurra un error con un recurso.
      console.log('error con el recurso');
      console.log(error);

      // return Promise.reject(error);
    }

    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
