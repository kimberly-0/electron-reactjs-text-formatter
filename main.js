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

// Split text into lines (where there's an enter)
function splitTextIntoLines(text) {
    return text.split(/\r?\n/);
}

// Split line into columns (where there's two or more spaces)
function splitLineIntoColumns(line) {
    return line.trim().split(/\s{2,}/);
}

// Get text form input from Home page
ipcMain.on('submit:text', (e, text) => {
    detectColumns(text);  
});

// Detect existing columns of first line
function detectColumns(text) {

    const lines = splitTextIntoLines(text);
    const columns = splitLineIntoColumns(lines[0]);

    // Send columns to renderer -> to select an option for each column
    mainWindow.webContents.send('columns:detected', columns);
}

// Get options form input from Options page
ipcMain.on('submit:options', (e, args) => {
    formatText(args.text, args.columnOptions);
});

// Format text based on options selected
function formatText(text, columnOptions) {
    const formattedText = [];
    const lines = splitTextIntoLines(text);
    
    // Iterate through the lines in the text
    for (let l = 0; l < lines.length; l++) {
        let formattedLine = [];
        const columns = splitLineIntoColumns(lines[l]);

        // If there's only 1 column and option to delete is selected, leave for loop immediately
        if (columns.length == 1 && columnOptions[0] == "") {
            break;
        }

        // Iterate through columns of the line
        for (let c = 0; c < columns.length; c++) {
            switch (columnOptions[c]) {
                case 'plaats':
                    formattedLine.push(columns[c] + ".");
                    break;
                case 'naam':
                    formattedLine.push(columns[c] + ",");
                    break;
                case 'gemeente':
                    formattedLine.push(columns[c] + ",");
                    break;
                case 'snelheid':
                    // Haal nummers achter te komma of punt weg
                    const beforeComma = columns[c].split(/[,.]/);
                    formattedLine.push(beforeComma[0] + " m");
                    break;
                default:
                    columns[c] = "";
                    break;
            }
        }

        // Merge columns into one line
        let formattedLineMerged = formattedLine.join(' ').trim();

        // If this is the last line, end with '.', otherwise end line with ';'
        if (l == lines.length - 1) {
            formattedLineMerged = formattedLineMerged + ".";
        } else {
            formattedLineMerged = formattedLineMerged + "; ";
        }

        // Add line to formatted text
        formattedText.push(formattedLineMerged);
    }

    // Send formattedText to renderer
    let formattedTextMerged = formattedText.join('');
    mainWindow.webContents.send('text:formatted', formattedTextMerged);
}

// Get result form input from Result page
ipcMain.on('copy:result', (e, result) => {
    // Write the value of the text field to system clipboard
    const { clipboard } = require('electron');
    clipboard.writeText(result);

    // Send confirmation to renderer
    mainWindow.webContents.send('copy:done');
});

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
