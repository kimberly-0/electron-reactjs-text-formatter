const { formatText } = require('../format');

const { textCompuclub, columnOptionsCompuclub, textKbdb, columnOptionsKbdb } = require('./sampleData');

/*
Test error handling
*/

test('throws error if no text is provided', () => {
    expect(() => formatText()).toThrow('Geen tekst voorzien');
})

test('throws error if no column options are provided', () => {
    expect(() => formatText('text')).toThrow('Geen kolom opties voorzien');
})

test('throws error if column options are empty', () => {
    const columnOptions = [];
    expect(() => formatText('text', columnOptions)).toThrow('Geen kolom opties voorzien');
})

/*
Test correct formatting
*/

test('returns empty string if column options are set to not keep any', () => {
    const columnOptions = [''];
    expect(formatText('text', columnOptions)).toEqual('');
})

test('formats text with source Compuclub correctly with most common options', () => {
    const result = "1. Name Surname, City, 1399 m; 2. Name Surname, City, 1393 m; 3. Name Surname, City, 1390 m; 4. Name Surname, City, 1388 m; 5. Name Surname, City, 1384 m; 6. Name Surname, City, 1377 m; 7. Name Surname, City, 1370 m; 8. Name Surname, City, 1370 m; 9. Name Surname, City, 1368 m; 10. Name Surname, City, 1367 m.";
    expect(formatText(textCompuclub, columnOptionsCompuclub, '', 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source KBDB correctly with most common options', () => {
    const result = "1. Name Surname, City, 1315 m; 2. Name Surname, City, 1292 m; 3. Name Surname, City, 1285 m; 4. Name Surname, City, 1280 m; 5. Name Surname, City, 1278 m; 6. Name Surname, City, 1277 m; 7. Name Surname, City, 1275 m; 8. Name Surname, City, 1272 m; 9. Name Surname, City, 1271 m; 10. Name Surname, City, 1271 m.";
    expect(formatText(textKbdb, columnOptionsKbdb, '', 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source Compuclub correctly with full text options adjusted', () => {
    const result = "1. Name Surname, City, 1399.206 m; 2. Name Surname; 3. Name Surname; 4. Name Surname; 5. Name Surname; 6. Name Surname; 7. Name Surname; 8. Name Surname; 9. Name Surname; 10. Name Surname.";
    expect(formatText(textCompuclub, columnOptionsCompuclub, '', 'eerste', 'eerste', 3)).toEqual(result);
})

test('formats text with source KBDB correctly with full text options adjusted', () => {
    const result = "1. Name Surname, City, 1315.4126 m; 2. Name Surname; 3. Name Surname; 4. Name Surname; 5. Name Surname; 6. Name Surname; 7. Name Surname; 8. Name Surname; 9. Name Surname; 10. Name Surname.";
    expect(formatText(textKbdb, columnOptionsKbdb, '', 'eerste', 'eerste', 4)).toEqual(result);
})

test('formats text with source Compuclub correctly without city (gemeente)', () => {
    const columnOptionsCompuclubWithoutCity = ['plaats', 'naam', '', '', '', '', '', '', '', 'snelheid', '', ''];
    const result = "1. Name Surname, 1399 m; 2. Name Surname, 1393 m; 3. Name Surname, 1390 m; 4. Name Surname, 1388 m; 5. Name Surname, 1384 m; 6. Name Surname, 1377 m; 7. Name Surname, 1370 m; 8. Name Surname, 1370 m; 9. Name Surname, 1368 m; 10. Name Surname, 1367 m.";
    expect(formatText(textCompuclub, columnOptionsCompuclubWithoutCity, '', 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source KBDB correctly without city (gemeente)', () => {
    const columnOptionsKbdbWithoutCity = ['plaats', '', '', 'naam', '', '', '', '', '', 'snelheid', ''];
    const result = "1. Name Surname, 1315 m; 2. Name Surname, 1292 m; 3. Name Surname, 1285 m; 4. Name Surname, 1280 m; 5. Name Surname, 1278 m; 6. Name Surname, 1277 m; 7. Name Surname, 1275 m; 8. Name Surname, 1272 m; 9. Name Surname, 1271 m; 10. Name Surname, 1271 m.";
    expect(formatText(textKbdb, columnOptionsKbdbWithoutCity, '', 'overal', 'overal', 0)).toEqual(result);
})

test('formats text and keeps city and speed on all lines with invalid full text options', () => {
    const result = "1. Name Surname, City, 1315.4126 m; 2. Name Surname, City, 1292.9831 m; 3. Name Surname, City, 1285.4297 m; 4. Name Surname, City, 1280.0502 m; 5. Name Surname, City, 1278.3028 m; 6. Name Surname, City, 1277.3696 m; 7. Name Surname, City, 1275.9706 m; 8. Name Surname, City, 1272.8766 m; 9. Name Surname, City, 1271.6230 m; 10. Name Surname, City, 1271.3305 m.";
    expect(formatText(textKbdb, columnOptionsKbdb, '', 'invalid', 'invalid', 'invalid')).toEqual(result);
})

test('keeps columns for which invalid column options are provided ... ...', () => {
    const columnOptions = ['invalid'];
    expect(formatText('text', columnOptions)).toBe('text.');
})

test('keeps columns for which invalid column options are provided ... ...', () => {
    const columnOptions = ['invalid', 'invalid', 'invalid', '', '', '', '', '', '', 'invalid', '', ''];
    const result = "1 Name Surname City 1399,206; 2 Name Surname City 1393,380; 3 Name Surname City 1390,094; 4 Name Surname City 1388,788; 5 Name Surname City 1384,945; 6 Name Surname City 1377,651; 7 Name Surname City 1370,948; 8 Name Surname City 1370,026; 9 Name Surname City 1368,197; 10 Name Surname City 1367,633.";
    expect(formatText(textCompuclub, columnOptions)).toBe(result);
})