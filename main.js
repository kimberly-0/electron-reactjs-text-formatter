const path = require('path');
const { app, BrowserWindow, ipcMain, Notification } = require('electron');

const isMac = process.platform === 'darwin'; // Check if platform is a Mac (darwin: mac, win32: windows, linux: linux)

// process.env.NODE_ENV = 'production';
const isDev = process.env.NODE_ENV !== 'production'; // Check if we're in DEV mode

// Auto reload window on change if in DEV mode
if (isDev) {
    console.log('dev mode');
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
    })
}

/*
---- CREATE WINDOWS ----
*/

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "Electron app with ReactJS",
        width: isDev ? 1300 : 1000,
        height: 800,
        backgroundColor: "white",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Open developer tools in window if in DEV mode
    if (isDev) { mainWindow.webContents.openDevTools(); }

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

/*
---- FUNCTIONALITY ----
*/

ipcMain.on('notify', (_, message) => {
    new Notification({title: 'Notification', body: message}).show();
})

ipcMain.on('submit:text', (e, text) => {
    console.log(text);    
});

/*
---- START AND STOP RUNNING APP ----
*/

// App is ready
app.whenReady().then(() => {
    createMainWindow();

    // Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createMainWindow()
        }
    })
});

// If not on a Mac, then quit the process when windows are closed, otherwise it keeps running
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
});
