import React from 'react';
import { Provider } from 'react-redux';
import { Layout } from '../../components/layout';
import '../../styles/global.scss';
import '../../utils/font-awesome';
import { store } from '../redux/store';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
