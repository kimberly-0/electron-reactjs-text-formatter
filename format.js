function formatText(text, columnsOptions, ftOptionsGemeenteWaar, ftOptionsSnelheidWaar, ftOptionsSnelheidNummers) {

    if (text === undefined || text === null || text.length <= 0 || isOnlyWhiteSpace(text)) {
        throw new Error('Geen tekst voorzien'); // No text provided
    }

    if (columnsOptions === undefined || columnsOptions.length <= 0) {
        throw new Error('Geen kolom opties voorzien'); // No column options provided
    }

    const formattedTextLines = [];

    const splittedText = splitUpTextIntoLinesAndColumns(text);

    for (let line = 0; line < splittedText.length; line++) {
        
        const formattedLineParts = [];

        for (let column = 0; column < splittedText[line].length; column++) {
            switch(columnsOptions[column]) {
                case "plaats":
                    formattedLineParts.push(stylePlaats(splittedText[line][column]));
                    break;
                case "naam":
                    formattedLineParts.push(styleNaamOfGemeente(splittedText[line][column]));
                    break;
                case "gemeente":
                    if (!(ftOptionsGemeenteWaar === "eerste" && line > 0)) {
                        formattedLineParts.push(styleNaamOfGemeente(splittedText[line][column]));
                    }
                    break;
                case "snelheid":
                    if (!(ftOptionsSnelheidWaar === "eerste" && line > 0)) {
                        formattedLineParts.push(styleSnelheid(splittedText[line][column], ftOptionsSnelheidNummers));
                    }
                    break;
                default:
                    // don't include in new text / delete
                    break;
            }
        }

        if (formattedLineParts.length > 0) {
            formattedTextLines.push(mergeColumnsIntoLine(formattedLineParts, line < splittedText.length - 1));
        }
    }

    const formattedTextMerged = formattedTextLines.join(' '); // lines separated by a space
    // const formattedTextEachOnNewLine = formattedTextLines.join('\n'); // lines separated by a new line char -> each on new line

    return formattedTextMerged;
}

function isOnlyWhiteSpace(text) {
    if (!text.replace(/\s/g, '').length) {
        return true;
    } else {
        return false;
    }
}

function splitUpTextIntoLinesAndColumns(text) {
    const splittedText = [];

    const lines = splitTextIntoLines(text);
    for (let line = 0; line < lines.length; line++) {
        splittedText.push(splitLineIntoColumns(lines[line]));
    }

    return splittedText;
}

function splitTextIntoLines(text) {
    if (text === undefined || text === "" || isOnlyWhiteSpace(text)) return [];
    return text.split(/\r?\n/);
}

function splitLineIntoColumns(line) {
    if (line === undefined || line === "" || isOnlyWhiteSpace(line)) return [];

    let columns = [];

    columns = line.trim().split(/[\t]/gm); // split on tab

    if (columns.length <= 1) {
        columns = line.trim().split(/\s{2,}/); // split on multiple spaces
    }
    return columns;
}

function stylePlaats(columnValue) {
    return columnValue + ".";
}

function styleNaamOfGemeente(columnValue) {
     if (!containsLowercase(columnValue)) {
        return capitalizeFirstLetterOfEachWord(columnValue);
    }
    return columnValue;
}

function styleSnelheid(columnValue, numOfDigitsAfterDecimalPoint) {
    if (columnValue === undefined || columnValue === "" || isOnlyWhiteSpace(columnValue)) return "";

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

function containsLowercase(str) {
    if (str === undefined) return false;
    return /[a-z]/.test(str);
}

function capitalizeFirstLetterOfEachWord(line) {
    if (line === undefined || line === "") return "";

    line = line.toLowerCase();

    const capitalizeAfterChars = [" ", "-", "&", "/", "("];
    for (let char = 0; char < capitalizeAfterChars.length; char++) {

        const parts = line.split(capitalizeAfterChars[char]);
        for (var i = 0; i < parts.length; i++) {

            // Capitalize first letter of each word, except for 'm', 'et', 'en'
            if (parts[i] !== "" && parts[i] !== "m" && parts[i] !== "et" && parts[i] !== "en") {
                parts[i] = parts[i][0].toUpperCase() + parts[i].slice(1);
            }
        }
        line = parts.join(capitalizeAfterChars[char]);
    }
    return line
}

// Lowercase certain parts of the name according to NL standards
// 'van', 'den', 'de', 'v.d.', 'v. d.', 'v d', 'v', 'd'
// function lowercaseNamesToFormattingNL(line) {
//     const wordsToLowercase = [" Van ", " Den ", " De ", " V.d. ", " V. D. "];
//     for (let s = 0; s < wordsToLowercase.length; s++) {
//         if (line.includes(wordsToLowercase[s])) {
//             const startIndex = line.indexOf(wordsToLowercase[s]);
//             const endIndex = startIndex + wordsToLowercase[s].length;

//             const stringBeforeWord = line.substring(0, startIndex);
//             const lowercasedWord = line.substring(startIndex, endIndex).toLowerCase();
//             const stringAfterWord = line.substring(endIndex, line.length);

//             line =  stringBeforeWord + lowercasedWord + stringAfterWord;
//         }
//     }
//     return line;
// }

function mergeColumnsIntoLine(formattedLineParts, isNotLastLine) {
    if (formattedLineParts === undefined) return;
    
    for (let part = 0; part < formattedLineParts.length; part++) {

        const lastChar = formattedLineParts[part].slice(-1);
        if (lastChar !== "." && lastChar !== "," && lastChar !== ";" && lastChar !== ":") {

            if (isOnlyWhiteSpace(formattedLineParts[part])) {
                continue;
            } else if (part < formattedLineParts.length - 1) {
                formattedLineParts[part] = formattedLineParts[part] + ",";
            } else {
                formattedLineParts[part] = formattedLineParts[part] + (isNotLastLine ? ";" : ".");
            }
        }
    }

    const formattedLine = formattedLineParts.join(' ');

    if (isOnlyWhiteSpace(formattedLine)) {
        return "";
    } else {
        return formattedLine;
    }
}

module.exports = { formatText, splitUpTextIntoLinesAndColumns, splitTextIntoLines, splitLineIntoColumns, stylePlaats, styleNaamOfGemeente, styleSnelheid, containsLowercase, capitalizeFirstLetterOfEachWord, mergeColumnsIntoLine };
