const path = require('path');
const { app, BrowserWindow, Menu, ipcMain  } = require('electron');
const { formatText, splitTextIntoLines, splitLineIntoColumns } = require('./format');

if (require('electron-squirrel-startup')) app.quit();

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
ipcMain.on('detectColumns', (e, args) => {
    detectColumns(args.data.unformattedText, args.data.source);  
});

// Detect existing columns of first line
function detectColumns(text, source) {
    const lines = splitTextIntoLines(text);
    const columns = splitLineIntoColumns(lines[0], source);

    // Send columns to renderer -> to select an option for each column
    mainWindow.webContents.send('columnsDetected', {text, source, columns});
}

// Get options form input from Options page
ipcMain.on('formatText', (e, args) => {
    const columnsOptions = args.data.columnsOptions.map(value => value.columnType);

    let fullTextOptionsNaamLand = "";
    let fullTextOptionsGemeenteWaar = "";
    let fullTextOptionsSnelheidWaar = "";
    let fullTextOptionsSnelheidNummers = 0;

    args.data.fullTextOptions.forEach(function (item, index) {
        if (item.columnType === 'naam' && item.option === 'land') fullTextOptionsNaamLand = item.selection;
        if (item.columnType === 'gemeente' && item.option === 'waar') fullTextOptionsGemeenteWaar = item.selection;
        if (item.columnType === 'snelheid') {
            if (item.option === 'waar') fullTextOptionsSnelheidWaar = item.selection;
            if (item.option === 'nummers') fullTextOptionsSnelheidNummers = item.selection;
        }
    });

   const formattedText = formatText(args.data.unformattedText, args.data.source, columnsOptions, fullTextOptionsNaamLand, fullTextOptionsGemeenteWaar, fullTextOptionsSnelheidWaar, fullTextOptionsSnelheidNummers); 

    mainWindow.webContents.send('textFormatted', formattedText);
});

// Get result form input from Result page
ipcMain.on('copy:result', (e, result) => {
    // Write the value of the text field to system clipboard
    const { clipboard } = require('electron');
    clipboard.writeText(result);

    // Send confirmation to renderer
    mainWindow.webContents.send('copy:done');
});

/*
---- CREATE MENUS ----
*/

// Application menu (bar at top)
const applicationMenuTemplate = [{
    label: app.name,
    submenu: [
        { label: 'Quit', accelerator: "Command+Q", click: () => app.quit() }
    ]},{
        label: "Edit",
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
    ]},{
        label: "View",
        submenu: [
            { role: "reload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetzoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" }
        ]} 
];

// Context menu (right click)
const contextMenuTemplate = [
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'undo' },
    { role: 'redo' },
];

/*
---- CREATE WINDOWS ----
*/
let mainWindow;
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Tekst opmaken",
        width: isDev ? 1300 : 1000,
        height: 850,
        backgroundColor: "white",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        // icon: path.join(__dirname, 'src/js/assets/logo/icon.icns')
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

    // Implement menus
    const applicationMenu = Menu.buildFromTemplate(applicationMenuTemplate);
    Menu.setApplicationMenu(applicationMenu);
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    mainWindow.webContents.on('context-menu', (e, params) => {
        contextMenu.popup(mainWindow, params.x, params.y);
    })

    // Remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createMainWindow()
        }
    })

    // Send app info to console
    // console.log(app.name + " | version: " +  app.getVersion());
});

// If not on a Mac, then quit the process when windows are closed, otherwise it keeps running
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
});
