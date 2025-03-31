let currentScale = 1.0;
const ZOOM_STEP = 0.1;

function applyScale(scale: number) {
  document.body.style.transform = `scale(${scale})`;
  document.body.style.transformOrigin = '0 0';
  document.documentElement.style.width = `${100 / scale}%`;
  document.documentElement.style.height = `${100 / scale}%`;

  localStorage.setItem('zoomScale', String(scale));
}

export function useWindowScale() {
  const wheelListener = (e: WheelEvent) => {
    console.log(e);
    if (e.ctrlKey) {
      e.preventDefault();
      const currentZoom = parseFloat(document.body.style.zoom || '1');
      const newZoom = e.deltaY < 0 ? currentZoom * 1.1 : currentZoom * 0.9;
      document.body.style.zoom = String(Math.min(2, Math.max(0.5, newZoom)));
    }
  };

  const keydownListener = (e: KeyboardEvent) => {
    const isCtrlPressed = e.ctrlKey || e.metaKey;

    if (!isCtrlPressed) return;

    switch (e.key) {
      case '+':
        console.log(e.key);
        currentScale = Math.min(2.0, currentScale + ZOOM_STEP);
        applyScale(currentScale);
        e.preventDefault();
        break;

      case '-':
        console.log(e.key);
        currentScale = Math.max(0.5, currentScale - ZOOM_STEP);
        applyScale(currentScale);
        e.preventDefault();
        break;
    }
  };

  document.addEventListener('wheel', wheelListener);
  document.addEventListener('keydown', keydownListener);

  return () => {
    document.removeEventListener('wheel', wheelListener);
    document.removeEventListener('keydown', keydownListener);
  };
}
