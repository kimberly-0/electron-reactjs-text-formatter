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
---- FUNCTIONALITY ----
*/

// Get text form input from Home page
ipcMain.on('submit:text', (e, text) => {
    detectColumns(text);  
});

// Detect existing columns of first line
function detectColumns(text) {

    const lines = text.split(/\r?\n/); // split text into lines
    const firstLine = lines[0].trim(); // remove excess space at beginning and end
    const columns = firstLine.split(/\s{2,}/); // split line into columns (where there's two or more spaces)

    console.log(columns);

    // Send columns to renderer
    mainWindow.webContents.send('columns:detected', columns);

    // send columns to front-end -> in a form: for each column, create select input
}

// Get options form input from Options page
ipcMain.on('submit:options', (e, args) => {
    formatText(args.text, args.columnOptions);
});

// Format text based on options selected
function formatText(text, columnOptions) {
    console.log("IN FORMAT TEXT FUNC");
    console.log(text);
    console.log(columnOptions); 

    const formattedText = text;

    // Send formattedText to renderer
    mainWindow.webContents.send('text:formatted', formattedText);
}


/*
---- CREATE WINDOWS ----
*/
let mainWindow;
function createMainWindow() {
    mainWindow = new BrowserWindow({
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
