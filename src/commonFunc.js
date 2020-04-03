/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function setDocumentTitle(title) {
  document.title = title;
  const ua = navigator.userAgent;
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/;
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement("iframe");
    i.src = "/favicon.ico";
    i.style.display = "none";
    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
};

export const timeFix = function () {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ?
    "早上好" :
    hour <= 11 ?
    "上午好" :
    hour <= 13 ?
    "中午好" :
    hour < 20 ?
    "下午好" :
    "晚上好";
};
