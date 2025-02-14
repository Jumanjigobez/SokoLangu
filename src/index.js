import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
=======

import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import RootReducer from './store/reducers';

import "react-toastify/dist/ReactToastify.css";

import './style.css';

import MainRoutes from './routes';

const Store = createStore(RootReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={Store}>
    <MainRoutes />
  </Provider>


);

>>>>>>> 9befd2f057704c80115250feac27ee492fda140d
