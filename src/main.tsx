
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add error handling for initialization
try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
  
} catch (error) {
  console.error('Failed to initialize app:', error);
  
  // Fallback rendering for critical errors
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">
        <div style="text-align: center; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 16px;">App Failed to Load</h1>
          <p style="color: #6b7280; margin-bottom: 20px;">Please refresh the page or try again later.</p>
          <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
