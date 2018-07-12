const listURL = "http://www.softomate.net/ext/employees/list.json";

const getDataLocal = (keys) => new Promise(r => chrome.storage.local.get(keys, r));
const addMessageListener = (fn) => chrome.extension.onMessage.addListener(fn);

const getJSON = (url) => fetch(url).then(response =>
  response.json().then(data => ({
    data: data,
    status: response.status
  }))
);

// set data
const setData = (cb) => {
  getJSON(listURL).then(res => {
    chrome.storage.local.set({list: res.data}, cb);
  })
}

// time install
chrome.runtime.onInstalled.addListener(_=> {
  setData(sendData);
  // refresh the data one time per hour
  var refresherTimer = setTimeout(function refresh(){
    setData(sendData);
    refresherTimer = setTimeout(refresh, 36e5);
  }, 36e5)
});

// send data by extension
const sendData = () => {
  getDataLocal('list').then(result => {
    const tabUpdated = false;
    const checkURI = (template, url) => new RegExp('^(https?:\/\/)?([a-zA-Z]+?\.)?' + template).test(url);
    result.list.forEach(element => {
      chrome.tabs.onUpdated.addListener((id, info, tab) => {
        if(
          info.status == 'complete'
          && tab.status == 'complete'
          && tab.url != undefined
          && !tabUpdated
          && checkURI(element.domain, tab.url)
        )  chrome.tabs.sendMessage(id, {text: element.message, domain: element.domain})
      })
    });
    addMessageListener((req, sender, cb) => req === 'popup' && cb(result.list));
  })
}






