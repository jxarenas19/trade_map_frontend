import { authHeader } from './auth-header';
import request from "../../utils/request";

export const userService = {
    login,
    logout,
    register,
    getAll,
};

function login(email, password) {

    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    // };
    return request.post('/users/authenticate', { email, password }).then(handleResponse)
        .then(user => {
            console.log(user)
            // login successful if there's a jwt token in the response
            if (user.access_token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {

    if (response.message === 'Usuario o contraseña incorrecta') {
            // auto logout if 401 response returned from api
            logout();
            const error = response.message;
            return Promise.reject(error);
            // location.reload(true);
    }

    return response;
}
