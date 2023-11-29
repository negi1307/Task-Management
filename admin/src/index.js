import React from 'react';
import ReactDOM from 'react-dom';
import './global.css';
import './i18n';

import App from './App';

import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.render(
    <Provider store={configureStore({})}>
        <App />
        <ToastContainer />
    </Provider>,
    document.getElementById('root')
);
