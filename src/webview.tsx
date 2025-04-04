import ReactDOM from 'react-dom/client';
import React, { useEffect } from 'react';
import { emit, listen } from '@tauri-apps/api/event';
import { moveWindow, Position } from '@tauri-apps/plugin-positioner';

import './webview.css';

export default function App() {
  useEffect(() => {
    moveWindow(Position.BottomLeft);

    listen<string>('set_webview_link', e => {
      console.log('listen:set_webview_link', e.payload);

      const iframe = document.querySelector<HTMLIFrameElement>('#webview');

      if (iframe) {
        iframe.src = e.payload;
      } else {
        console.error('iframe nor found');
      }
    });

    emit('fetch_webview_link');
  }, []);

  return (
    <div className="main">
      <iframe id="webview" sandbox="allow-scripts allow-same-origin" allow="fullscreen"></iframe>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
