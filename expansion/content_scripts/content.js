//vars
const body = document.body;
const visits = 1;

//templates
const messageTemplate = (text) => `<div id="message"> ${text} <span id="message__close">x</span></div>`;

const setCookie = (name,value) => {
  document.cookie = `${name}=${value}; path=/; expires=;`
}
const getCookie = name => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
const closeMessage = (name) => {
  const message = document.querySelector('#message');
  const cross = document.querySelector('#message__close');
  cross.onclick = () => {
    setCookie(name, false);
    body.removeChild(message);
  };
}
const visitsUp = (name) => +getCookie(name) + 1;

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  // console.log(getCookie(msg.domain))
  if(getCookie(msg.domain) == 'undefined' || getCookie(msg.domain) == 'NaN' ){
    setCookie(msg.domain, visits);
    body.insertAdjacentHTML('afterbegin', messageTemplate(msg.text));
    closeMessage(msg.domain);
  } else if (parseInt(getCookie(msg.domain)) >= 2) {
    setCookie(msg.domain, false);
  } else if(getCookie(msg.domain) == 'false'){
    console.log('false')
  } else {
    setCookie(msg.domain, visitsUp(msg.domain));
    body.insertAdjacentHTML('afterbegin', messageTemplate(msg.text));
    closeMessage(msg.domain);
  }
});




