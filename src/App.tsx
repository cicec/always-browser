import { BrowserForm } from './components/app/browser-form';
import { ThemeProvider } from '@/components/core/theme-provider';

import './App.css';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <div className="flex flex-col items-center justify-center min-h-svh">
        <div className="main">
          <BrowserForm></BrowserForm>
        </div>
      </div>
    </ThemeProvider>
  );
}
