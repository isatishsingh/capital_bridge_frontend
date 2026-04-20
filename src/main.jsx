import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import { ToastProvider } from './components/feedback/ToastProvider';
import { getRazorpayKeyIdError } from './utils/razorpayKey';

if (import.meta.env.DEV) {
  const razorpayKeyIssue = getRazorpayKeyIdError(import.meta.env.VITE_RAZORPAY_KEY);
  if (razorpayKeyIssue) {
    console.warn('[CrowdSpring] Razorpay:', razorpayKeyIssue);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);
