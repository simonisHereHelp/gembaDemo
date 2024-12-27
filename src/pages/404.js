import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function NotFound() {
  const history = useHistory();

  useEffect(() => {
    // Automatically redirect to the 'prov1' document after 3 seconds
    setTimeout(() => {
      history.push('/docs/prov1');
    }, 3000); // You can adjust the delay if needed
  }, [history]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Page Not Found</h1>
      <p>Redirecting you to the documentation...</p>
      <p>If you are not redirected automatically, <a href="/docs/prov1">click here</a>.</p>
    </div>
  );
}
