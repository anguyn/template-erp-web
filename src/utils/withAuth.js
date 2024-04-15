import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

function withAuth(WrappedComponent) {
  return (props) => {
    const router = useRouter();

    const isAuthenticated = !!Cookies.get('user');

    useEffect(() => {
      if (typeof window !== 'undefined') {
        // Only execute the redirect logic on the client-side
        if (!isAuthenticated) {
          router.replace('/auth/login');
        }
      }
    }, [isAuthenticated, router]);

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;
