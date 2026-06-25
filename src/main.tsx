import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign ResizeObserver and cross-origin Script errors
if (typeof window !== 'undefined') {
  const preventResizeObserverError = (e: ErrorEvent) => {
    if (
      e.message && 
      (e.message.includes('ResizeObserver') || 
       e.message.includes('Resize observer') || 
       e.message === 'Script error.' || 
       e.message.includes('Script error'))
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  };
  window.addEventListener('error', preventResizeObserverError);
  
  // Direct window.onerror fallback to catch raw "Script error."
  const oldOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    const msg = message ? message.toString() : '';
    if (msg.includes('Script error') || msg === 'Script error.') {
      return true; // Stop propagation
    }
    if (msg.includes('ResizeObserver') || msg.includes('Resize observer')) {
      return true;
    }
    if (oldOnError) {
      return oldOnError.apply(this, [message, source, lineno, colno, error]);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const msg = e.reason?.message || e.reason;
    if (typeof msg === 'string' && (msg.includes('ResizeObserver') || msg.includes('Resize observer') || msg.includes('Script error'))) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
