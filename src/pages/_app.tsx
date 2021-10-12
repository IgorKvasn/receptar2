import React from 'react';
import { Layout } from '../../components/layout';
import '../../styles/global.scss';
import '../../utils/font-awesome';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
