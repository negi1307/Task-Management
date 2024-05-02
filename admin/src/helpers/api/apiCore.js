import jwtDecode from 'jwt-decode';
import axios from 'axios';
import config from '../../config';

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = config.API_URL;

// intercepting to capture errors
// axios.interceptors.response.use(
//     (response) => {
//         const navigate = useNavigate();
//         if (response?.status === 201) {
//             localStorage.clear();
//             sessionStorage.clear();
//             navigate('/logout2')
//             return response;
//         }
//         return response;
//     },
//     (error) => {
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         let message;
//         if (error && error.response && error.response.status === 404) {
//             // window.location.href = '/not-found';
//         }

//         else if (error && error.response && error.response.status === 403) {
//             // alert(error)
//             // window.location.href = '/access-denied';
//         }
//         else if (error && error.response && error.response.status === 401) {
//             // Handle 401 error (token unauthorized or expired)
//             localStorage.removeItem('hyper_user');
//         }
//         else {
//             switch (error.response.status) {
//                 case 401:
//                     message = 'Invalid credentials';
//                     break;
//                 case 403:
//                     message = 'Access Forbidden';
//                     break;
//                 case 404:
//                     message = 'Sorry! the data you are looking for could not be found';
//                     break;
//                 default: {
//                     message =
//                         error.response && error.response.data ? error.response.data['message'] : error.message || error;
//                 }
//             }
//             return Promise.reject(message);
//         }
//     }
// );

axios.interceptors.response.use(
    (response) => {
        if (response?.status === 201) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/account/login '; // Navigate using window.location
            return response;
        }
        return response;
    },
    (error) => {
        // Handle errors here
        let message;
        if (error && error.response && error.response.status === 404) {
            // window.location.href = '/not-found';
        }

        else if (error && error.response && error.response.status === 403) {
            // alert(error)
            // window.location.href = '/access-denied';
        }
        else if (error && error.response && error.response.status === 401) {
            // Handle 401 error (token unauthorized or expired)
            localStorage.removeItem('hyper_user');
        }
        else {
            switch (error.response.status) {
                case 401:
                    message = 'Invalid credentials';
                    break;
                case 403:
                    message = 'Access Forbidden';
                    break;
                case 404:
                    message = 'Sorry! the data you are looking for could not be found';
                    break;
                default: {
                    message =
                        error.response && error.response.data ? error.response.data['message'] : error.message || error;
                }
            }
            return Promise.reject(message);
        }
    }
);



const AUTH_SESSION_KEY = 'hyper_user';

/**
 * Sets the default authorization
 * @param {*} token
 */
// const setAuthorization = (token) => {

//     if (token) axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
//     else delete axios.defaults.headers.common['Authorization'];
// };

// const getUserFromSession = () => {
//     const user = sessionStorage.getItem(AUTH_SESSION_KEY);
//     return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
// };


const setAuthorization = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
        localStorage.setItem(AUTH_SESSION_KEY, token);
        // console.log({ AUTH_SESSION_KEY })
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem(AUTH_SESSION_KEY); // Remove token from local storage if not available
    }
};
const getUserFromSession = () => {
    const token = localStorage.getItem(AUTH_SESSION_KEY); // Retrieve token from local storage
    if (token) {
        const decodedToken = jwtDecode(token);
        // console.log({ decodedToken })
        return { token, ...decodedToken };
    }
    return null;
};

class APICore {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
            response = axios.get(`${url}?${queryString}`, params);
        } else {
            response = axios.get(`${url}`, params);
        }
        return response;
    };

    getFile = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
            response = axios.get(`${url}?${queryString}`, { responseType: 'blob' });
        } else {
            response = axios.get(`${url}`, { responseType: 'blob' });
        }
        return response;
    };

    getMultiple = (urls, params) => {
        const reqs = [];
        let queryString = '';
        if (params) {
            queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
        }

        for (const url of urls) {
            reqs.push(axios.get(`${url}?${queryString}`));
        }
        return axios.all(reqs);
    };

    /**
     * post given data to url
     */
    create = (url, data) => {
        return axios.post(url, data);
    };

    /**
     * Updates patch data
     */
    updatePatch = (url, data) => {
        return axios.patch(url, data);
    };

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.put(url, data);
    };

    /**
     * Deletes data
     */
    delete = (url) => {
        return axios.delete(url);
    };

    /**
     * post given data to url with file
     */
    createWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.post(url, formData, config);
    };

    /**
     * post given data to url with file
     */
    updateWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.patch(url, formData, config);
    };

    isUserAuthenticated = () => {
        const user = this.getLoggedInUser();
        if (!user || (user && !user.token)) {
            return false;
        }
        if (!user.token) {
            return false
        }
        return true
        // const user = this.getLoggedInUser();
        // if (!user || (user && !user.token)) {
        //     return false;
        // }
        // const decoded = jwtDecode(user.token);
        // const currentTime = Date.now() / 1000;
        // if (decoded.exp < currentTime) {
        //     console.warn('access token expired');
        //     return false;
        // } else {
        //     return true;
        // }
    };


    setLoggedInUser = (session) => {
        if (session) sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        else {
            sessionStorage.removeItem(AUTH_SESSION_KEY);
        }
    };

    /**
     * Returns the logged in user
     */
    getLoggedInUser = () => {
        return getUserFromSession();
    };

    setUserInSession = (modifiedUser) => {
        let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (userInfo) {
            const { token, user } = JSON.parse(userInfo);
            this.setLoggedInUser({ token, ...user, ...modifiedUser });
        }
    };
}

/*
Check if token available in session
*/



// let user = getUserFromSession();
// if (user) {
//     const { token } = user;
//     if (token) {
//         setAuthorization(token);
//     }
// }
let user = getUserFromSession();
if (user && user.token) {
    setAuthorization(user.token);
}

export { APICore, setAuthorization, getUserFromSession };
