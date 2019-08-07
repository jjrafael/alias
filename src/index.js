import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import reducers from './reducers';
import api from './middleware/api';
import * as serviceWorker from './serviceWorker';

const composeEnhancers =
typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const enhancer = composeEnhancers(applyMiddleware(reduxThunk, api));
const store = createStore(reducers, enhancer);

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();