import React from 'react';
import { Provider } from 'react-redux';
import { Layout } from '../../components/layout';
import '../../styles/global.scss';
import '../../utils/font-awesome';
import { store } from '../redux/store';
import axios from 'axios';
import { useRouter } from 'next/router';
import { RouteGuard } from '../../components/route-guard/ RouteGuard';
import { useAppDispatch, useAppSelector } from '../redux/redux-hooks';
import {
  LOGGED_COOKIE_NAME,
  logoutUser,
  setLoggedUserToken
} from '../redux/slices/userSlice';
import Cookies from 'js-cookie';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp(props) {
  return (
    <Provider store={store}>
      <AppInner {...props}></AppInner>
    </Provider>
  );
}

function AppInner({ Component, pageProps }) {
  const router = useRouter();
  const { jwtToken, loggedUser } = useAppSelector((state) => state.loggedUser);

  const dispatch = useAppDispatch();

  function initAxiosInterceptors() {
    // Add a request interceptor
    axios.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        if (jwtToken) {
          config.headers = {
            Authorization: `Bearer ${jwtToken}`
          };
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response.status === 401) {
          dispatch(logoutUser());
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );
  }

  initAxiosInterceptors();

  let token = Cookies.get(LOGGED_COOKIE_NAME);
  if (token && !loggedUser) {
    dispatch(setLoggedUserToken(token));
  }

  return (
    <Layout>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </Layout>
  );
}
