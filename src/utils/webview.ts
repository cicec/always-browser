import { emit, listen } from '@tauri-apps/api/event';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

type WindowConfig = {
  label: string;
  link: string;
  title?: string;
  userAgent?: string;
};

export const createWebview = async (config: WindowConfig) => {
  const width = 400;
  const height = 300;

  const webview = new WebviewWindow(config.label, {
    url: 'webview.html',
    title: config.title,
    width,
    height,
    alwaysOnTop: true,
    zoomHotkeysEnabled: true,
    // decorations: false,
    // transparent: true,
  });

  webview.once('tauri://created', async () => {
    await listen('fetch_webview_link', async () => {
      console.log('listen:fetch_webview_link', config.link);

      await emit('set_webview_link', config.link);
    });
  });

  webview.once('tauri://error', (e: any) => {
    console.error(`窗口创建失败: ${e.payload}`);
  });
};
