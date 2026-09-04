import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999] flex items-end justify-center p-4 pb-[113px]">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col rounded-2xl">
        <h2 className="text-lg font-bold mb-4 text-slate-900 flex-shrink-0">{title}</h2>
        <div className="text-sm text-slate-800 space-y-2 overflow-y-auto flex-grow">{children}</div>
        <button 
          onClick={() => { console.log('Button clicked'); onConfirm(); }} 
          className="mt-6 w-full py-2 bg-gradient-to-b from-slate-700 via-slate-900 to-black text-slate-100 border-t border-slate-600/50 rounded-lg shadow-inner hover:from-slate-800 hover:to-slate-950 flex-shrink-0 font-medium tracking-wide transition-all duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export const LegalFooter = () => {
  const [modal, setModal] = useState<string | null>(null);

  const logConsent = async (action: string) => {
    try {
      await addDoc(collection(db, 'user_consent_logs'), {
        action,
        timestamp: serverTimestamp(),
      });
      console.log('Consent logged successfully');
    } catch (e) {
      console.error('Error logging consent: ', e);
    }
    setModal(null);
  };

  return (
    <>
      <div className="flex gap-4">
        <button onClick={() => setModal('privacy')} className="hover:text-indigo-600">Privacy Policy</button>
        <button onClick={() => setModal('cookies')} className="hover:text-indigo-600">Cookie Consent</button>
        <button onClick={() => setModal('legal')} className="hover:text-indigo-600">Legal Info (ECTA)</button>
      </div>
      
      <Modal isOpen={modal === 'privacy'} onClose={() => setModal(null)} onConfirm={() => logConsent('privacy_acknowledged')} title="Privacy Policy">
        <p>Your privacy is important to us. We collect minimal data for operational purposes only...</p>
      </Modal>
      <Modal isOpen={modal === 'cookies'} onClose={() => setModal(null)} onConfirm={() => logConsent('cookies_acknowledged')} title="Cookie Policy">
        <p>We use essential cookies to keep you logged in and improve the application performance...</p>
      </Modal>
      <Modal isOpen={modal === 'legal'} onClose={() => setModal(null)} onConfirm={() => logConsent('legal_acknowledged')} title="Legal Info (ECTA)">
        <p>BrandFlow Pro is operated in compliance with the Electronic Communications and Transactions Act...</p>
      </Modal>
    </>
  );
};
