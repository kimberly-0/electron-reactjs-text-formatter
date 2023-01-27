const { ipcRenderer, contextBridge } = require('electron');

// const textForm = document.querySelector('#text-form');

contextBridge.exposeInMainWorld('electron', {
    notificationApi: {
        sendNotification(message) {
            ipcRenderer.send('notify', message);
        }
    }
})

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