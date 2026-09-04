import React, { useState, useEffect } from 'react';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-12 right-4 z-50 bg-white border border-slate-200 shadow-xl rounded-xl p-4 max-w-sm text-xs text-slate-700">
      <p className="mb-3">We use cookies to enhance your experience. By continuing to use this site, you agree to our use of cookies.</p>
      <div className="flex justify-end gap-2">
        <button onClick={accept} className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Accept</button>
      </div>
    </div>
  );
};
