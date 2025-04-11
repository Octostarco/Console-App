import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { OctostarContextProvider } from '@octostar/platform-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OctostarContextProvider>
      <App />
    </OctostarContextProvider>
  </StrictMode>
);
