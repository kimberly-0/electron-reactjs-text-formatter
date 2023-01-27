const { ipcRenderer, contextBridge } = require('electron');

// const textForm = document.querySelector('#text-form');

contextBridge.exposeInMainWorld('electron', {
    notificationApi: {
        sendNotification(message) {
            ipcRenderer.send('notify', message);
        }
    }
})

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});


// Send text to Main process
// textForm.addEventListener('submit', sendText);
// function sendText(e) {
//     e.preventDefault();

//     // const text = e.value;

//     console.log(e);

//     // Send to main using ipcRenderer
//     // ipcRenderer.send('text:process', {
//     //     text
//     // });
// }