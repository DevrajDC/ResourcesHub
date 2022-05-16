import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/custom.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
