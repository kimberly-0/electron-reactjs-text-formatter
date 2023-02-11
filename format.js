// Format text based on options selected
function formatText(text, source, columnOptions, ftOptionsNaamLand, ftOptionsGemeenteWaar, ftOptionsSnelheidWaar, ftOptionsSnelheidNummers) {

    if (text === undefined || text === null || text.length <= 0 || text === "") throw new Error('Geen tekst voorzien'); // No text provided
    if (columnOptions === undefined || columnOptions.length <= 0) throw new Error('Geen kolom opties voorzien'); // No column options provided

    const formattedText = [];

    // Iterate through the lines in the text and format each line
    const lines = splitTextIntoLines(text);

    for (let l = 0; l < lines.length; l++) {

        const columns = splitLineIntoColumns(lines[l], source);

        // Remove unnecessary columns from Line and columnOptions
        const newColumnOptions = [];
        const lineWithOnlyNecessaryColumns = [];
        for (let c = 0; c < columns.length; c++) {
            if (columnOptions[c] === "") {
                continue;
            } else {
                if (l > 0) { // If this is not the first line
                    if (columnOptions[c] === "gemeente" && ftOptionsGemeenteWaar == "eerste") {
                        continue;
                    }
                    if (columnOptions[c] === "snelheid" && ftOptionsSnelheidWaar == "eerste") {
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
            const formattedColumn = formatColumn(lineWithOnlyNecessaryColumns[c], newColumnOptions[c],ftOptionsSnelheidNummers, isLastColumn);
            formattedLineParts.push(formattedColumn);
        }

        // Merge columns into one line
        let formattedLine = formattedLineParts.join(' ').trim();

        if (!containsLowercaseExceptM(formattedLine)) {
            formattedLine = formattedLine.toLowerCase();
            const capitalizeAfterSymbols = [" ", "-", "(", "&", "/"];
            for (let s = 0; s < capitalizeAfterSymbols.length; s++) {
                formattedLine = capitalizeFirstLetterOfEachWord(formattedLine, capitalizeAfterSymbols[s]);
            }
        }

        // If name formatting for NL is selected, change following to small letters: 
        // 'van', 'den', 'de', 'v.d.', 'v. d.', 'v d', 'v', 'd'
        // if (ftOptionsNaamLand === "NL") {
        //     formattedLine = lowercaseNamesToFormattingNL(formattedLine);
        // } 

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

    return formattedTextMerged;
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

// Split text into lines (where there's an enter)
function splitTextIntoLines(text) {
    return text.split(/\r?\n/);
}

// Split line into columns (where there's two or more spaces OR tabs)
function splitLineIntoColumns(line, source) {
    let columns = [];

    if (source === "compuclub") {
        columns = line.trim().split(/\s{2,}/); // split on multiple spaces
    } else {
        columns = line.trim().split(/[\t]/gm); // split on tab
    }

    // If result is only one column (split into columns did not work), try the other split rule
    if (columns.length <= 1) {
        columns = (source === "compuclub") ? line.trim().split(/[\t]/gm) : line.trim().split(/\s{2,}/);
    }

    return columns;
}

function containsLowercaseExceptM(str) {
  return /[a-l|n-z]/.test(str);
}

// Capitalize first letter of each word in a line, except for 'm', 'et', 'en'
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

// Lowercase certain parts of the name according to NL standards
// 'van', 'den', 'de', 'v.d.', 'v. d.', 'v d', 'v', 'd'
function lowercaseNamesToFormattingNL(line) {
    const wordsToLowercase = [" Van ", " Den ", " De ", " V.d. ", " V. D. "];
    for (let s = 0; s < wordsToLowercase.length; s++) {
        if (line.includes(wordsToLowercase[s])) {
            const startIndex = line.indexOf(wordsToLowercase[s]);
            const endIndex = startIndex + wordsToLowercase[s].length;

            const stringBeforeWord = line.substring(0, startIndex);
            const lowercasedWord = line.substring(startIndex, endIndex).toLowerCase();
            const stringAfterWord = line.substring(endIndex, line.length);

            line =  stringBeforeWord + lowercasedWord + stringAfterWord;
        }
    }
    return line;
}

module.exports = { formatText, splitTextIntoLines, splitLineIntoColumns, capitalizeFirstLetterOfEachWord, lowercaseNamesToFormattingNL };