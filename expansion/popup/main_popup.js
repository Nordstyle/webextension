
// vars
const block = document.querySelector('#links');

// templates
const linkTemplate = (name,domain) => `<a class="loaded__link" href="http://${domain}" target="_blank"> ${name} </a>`;

//sendMessage to background.js
chrome.extension.sendMessage('popup', function(backMessage){
  block.innerHTML = ""
	backMessage.forEach(elem => {
    block.insertAdjacentHTML('afterbegin', linkTemplate(elem.name, elem.domain));
  })
});
