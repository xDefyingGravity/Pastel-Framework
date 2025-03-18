import { $reactive } from '../state';

interface PastelWindow {
  width: number;
  height: number;
  title: string;
}

const $window = new $reactive<PastelWindow>({
  width: window.innerWidth,
  height: window.innerHeight,
  title: window.document.title,
});

window.addEventListener('resize', () => {
  $window.set("width", window.innerWidth);
  $window.set("height", window.innerHeight);
})

$window.subscribe((data: any, changed: any[]) => {
  if (changed.includes("title")) {
    window.document.title = data.title;
  } else if (changed.includes("width") || changed.includes("height")) {
    window.resizeTo(data.width, data.height);
  }
});

export {
  $window,
};