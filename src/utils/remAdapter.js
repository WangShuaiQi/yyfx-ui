
let docEl = document.documentElement,
  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
let resizeTimer = 0;

/**
 * 窗口变化动态操作rem
 * @param docEl
 */
function resizeCall(docEl) {
  let clientWidth = docEl.clientWidth;
  if (!clientWidth) return;
  let font_size = 10 * (clientWidth / 1000);
  console.log(font_size + "窗口变化操作");
  if (font_size <= 18) {
    docEl.style.fontSize = font_size + 'px';
  } else if (font_size > 18) {
    docEl.style.fontSize = 18 + 'px';
  } else {
    docEl.style.fontSize = '14px';
  }
  console.log(docEl.style.fontSize)
}

window.addEventListener(resizeEvt, function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { resizeCall(docEl); }, 600);
}, false);

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => { resizeCall(docEl); }, false);
} else {
  setTimeout(() => { resizeCall(docEl); }, 100);
}
