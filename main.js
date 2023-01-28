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
---- FUNCTIONALITY - helper functions ----
*/

// Split text into lines (where there's an enter)
function splitTextIntoLines(text) {
    return text.split(/\r?\n/);
}

// Split line into columns (where there's two or more spaces)
function splitLineIntoColumns(line, source) {
    if (source == "compuclub") {
        return line.trim().split(/\s{2,}/);
    } else {
        return line.trim().split(/[\t]/gm);
    }
}

// Capitalize first letter of each word in a line
function capitalizeFirstLetterOfEachWord(line, splitChar) {
    const arr = line.split(splitChar);
    for (var i = 0; i < arr.length; i++) {
        string = arr[i];
        if (string !== "" && string !== "m" && string !== "et" && string !== "en") {
            arr[i] = string[0].toUpperCase() + string.slice(1);
        }
    }
    return arr.join(splitChar);
}

/*
---- FUNCTIONALITY ----
*/

// Get text form input from Home page
ipcMain.on('submit:text', (e, args) => {
    detectColumns(args.text, args.source);  
});

// Detect existing columns of first line
function detectColumns(text, source) {
    const lines = splitTextIntoLines(text);
    const columns = splitLineIntoColumns(lines[0], source);

    // Send columns to renderer -> to select an option for each column
    mainWindow.webContents.send('columns:detected', {text, source, columns});
}

// Get options form input from Options page
ipcMain.on('submit:options', (e, args) => {
    formatText(args.text, args.source, args.columnOptions, args.fullTextOptionsGemeente, args.fullTextOptionsSnelheid, args.fullTextOptionsSnelheidDigits);
});

// Format text based on options selected
function formatText(text, source, columnOptions, optionsGemeente, optionsSnelheid, snelheidDigits) {
    const formattedText = [];

    // Iterate through the lines in the text and format each line
    const lines = splitTextIntoLines(text);
    for (let l = 0; l < lines.length; l++) {

        const columns = splitLineIntoColumns(lines[l]);

        // Remove unnecessary columns from Line and columnOptions
        const newColumnOptions = [];
        const lineWithOnlyNecessaryColumns = [];
        for (let c = 0; c < columns.length; c++) {
            if (columnOptions[c] === "") {
                continue;
            } else {
                if (l > 0) { // If this is not the first line
                    if (columnOptions[c] === "gemeente" && optionsGemeente == "eerste") {
                        continue;
                    }
                    if (columnOptions[c] === "snelheid" && optionsSnelheid == "eerste") {
                        continue;
                    }
                }
                lineWithOnlyNecessaryColumns.push(columns[c]);
                newColumnOptions.push(columnOptions[c]);
            }
        }

        // If there are no columns left, leave loop immediatly
        if (lineWithOnlyNecessaryColumns.length <= 0) {
            break;
        }

        // Add styling to / format each column of the line
        const formattedLineParts = [];
        for (let c = 0; c < lineWithOnlyNecessaryColumns.length; c++) {
            const isLastColumn = c < newColumnOptions.length - 1 ? false : true;
            const formattedColumn = formatColumn(lineWithOnlyNecessaryColumns[c], newColumnOptions[c],snelheidDigits, isLastColumn);
            formattedLineParts.push(formattedColumn);
        }

        // Merge columns into one line
        let formattedLine = formattedLineParts.join(' ').trim();

        // If source is KBDB, change from caps to small letters with first letter cap
        if (source == "kbdb") {
            formattedLine = formattedLine.toLowerCase();
            const capitalizeAfterSymbols = [" ", "-", "(", "&", "/"];
            for (let s = 0; s < capitalizeAfterSymbols.length; s++) {
                formattedLine = capitalizeFirstLetterOfEachWord(formattedLine, capitalizeAfterSymbols[s]);
            }
        }

        // If this is the last line, end with '.', otherwise end line with ';'
        if (l == lines.length - 1) {
            formattedLine = formattedLine + ".";
        } else {
            formattedLine = formattedLine + "; ";
        }

        // Add line to formatted text
        formattedText.push(formattedLine);
    }

    // Send formattedText to renderer
    let formattedTextMerged = formattedText.join('');
    mainWindow.webContents.send('text:formatted', formattedTextMerged);
}

function formatColumn(columnValue, currColumnOption, numOfDigitsAfterDecimalPoint, isLastColumn) {

    if (currColumnOption === "plaats") {
        return columnValue + ".";

    } else if (currColumnOption === "naam" || currColumnOption === "gemeente") {
        return isLastColumn ? columnValue : columnValue + ",";

    } else if (currColumnOption === "snelheid") {
        const parts = columnValue.split(/[,.]/);

        if (numOfDigitsAfterDecimalPoint === 0) {
            return parts[0] + " m";
        } else if (numOfDigitsAfterDecimalPoint > 0) {
            let partAfterDecimalPoint = parts[1].slice(0, numOfDigitsAfterDecimalPoint);
            return parts[0] + "." + partAfterDecimalPoint + " m";
        } else {
            return columnValue + " m";
        }
    }
    return columnValue;
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
