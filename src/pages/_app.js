import { useRouter } from 'next/router';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import UserProvider from '@/context/UserContext';
import AdminLayout from '@/components/AdminLayout/AdminLayout';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isHeadmasterRoutes = router.pathname.startsWith('/admin/');

  return (
    <UserProvider>
      {isHeadmasterRoutes ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </UserProvider>
  );
}
