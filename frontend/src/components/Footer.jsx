import React, { useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  useEffect(() => {
    // Load Botpress scripts
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    const botpressScript = document.createElement('script');
    botpressScript.src = 'https://files.bpcontent.cloud/2025/03/05/16/20250305161046-2BU5IUPF.js';
    botpressScript.async = true;
    document.body.appendChild(botpressScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(injectScript);
      document.body.removeChild(botpressScript);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="team-info">
          <p>
            © {new Date().getFullYear()} All Rights Reserved | Built by{' '}
            <span className="team-members">
              Raghuveer C Gowda, Manju P, Gahana MS, and Pratheek BN
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 