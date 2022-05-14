import Layout from '../components/Layout';
import '../styles/custom.css';

export default function Nextra({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
