import { emit, listen } from '@tauri-apps/api/event';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

type WindowConfig = {
  label: string;
  link: string;
  title?: string;
  userAgent?: string;
};

export const createWebview = (config: WindowConfig) => {
  const webview = new WebviewWindow(config.label, {
    url: 'webview.html',
    title: config.title,
    width: 800,
    height: 600,
    alwaysOnTop: true,
    // decorations: false,
    // transparent: true,
  });

  webview.once('tauri://created', async () => {
    console.log('窗口创建成功');

    await listen('fetch_webview_link', async () => {
      console.log('listen:fetch_webview_link');
      await emit('set_webview_link', config.link);
    });
  });

  webview.once('tauri://error', (e: any) => {
    console.error(`窗口创建失败: ${e.payload}`);
  });
};
