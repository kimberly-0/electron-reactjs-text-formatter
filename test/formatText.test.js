const { formatText } = require('../format');

const { textCompuclub, columnOptionsCompuclub, textKbdb, columnOptionsKbdb } = require('./sampleData');

/*
Test error handling
*/

test('throws error if no text is provided', () => {
    expect(() => formatText()).toThrow('Geen tekst voorzien');
})

test('throws error if empty string is provided', () => {
    expect(() => formatText('')).toThrow('Geen tekst voorzien');
})

test('throws error if string with space is provided', () => {
    expect(() => formatText(' ')).toThrow('Geen tekst voorzien');
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
    const result = "1. John Doe, Springfield, 1399 m; 2. Emily Lee, Chicago, 1393 m; 3. David Johnson, Los Angeles, 1390 m; 4. Emily Lee, Chicago, 1388 m; 5. Michael Kim, San Francisco, 1384 m; 6. Sarah Brown, Boston, 1377 m; 7. Kevin Davis, Seattle, 1370 m; 8. Lisa Chen, Miami, 1370 m; 9. Adam Nguyen, Houston, 1368 m; 10. Sarah Brown, Boston, 1367 m.";
    expect(formatText(textCompuclub, columnOptionsCompuclub, 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source KBDB correctly with most common options', () => {
    const result = "1. Name Surname, City, 1315 m; 2. Name Surname, City, 1292 m; 3. Name Surname, City, 1285 m; 4. Name Surname, City, 1280 m; 5. Name Surname, City, 1278 m; 6. Name Surname, City, 1277 m; 7. Name Surname, City, 1275 m; 8. Name Surname, City, 1272 m; 9. Name Surname, City, 1271 m; 10. Name Surname, City, 1271 m.";
    expect(formatText(textKbdb, columnOptionsKbdb, 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source Compuclub correctly with full text options adjusted', () => {
    const result = "1. John Doe, Springfield, 1399.206 m; 2, 4. Emily Lee; 3. David Johnson; 5. Michael Kim; 6, 10. Sarah Brown; 7. Kevin Davis; 8. Lisa Chen; 9. Adam Nguyen.";
    expect(formatText(textCompuclub, columnOptionsCompuclub, 'eerste', 'eerste', 3)).toEqual(result);
})

test('formats text with source KBDB correctly with full text options adjusted', () => {
    const result = "1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Name Surname, City, 1315.4126 m.";
    expect(formatText(textKbdb, columnOptionsKbdb, 'eerste', 'eerste', 4)).toEqual(result);
})

test('formats text with source Compuclub correctly without city (gemeente)', () => {
    const columnOptionsCompuclubWithoutCity = ['plaats', 'naam', '', '', '', '', '', '', '', 'snelheid', '', ''];
    const result = "1. John Doe, 1399 m; 2. Emily Lee, 1393 m; 3. David Johnson, 1390 m; 4. Emily Lee, 1388 m; 5. Michael Kim, 1384 m; 6. Sarah Brown, 1377 m; 7. Kevin Davis, 1370 m; 8. Lisa Chen, 1370 m; 9. Adam Nguyen, 1368 m; 10. Sarah Brown, 1367 m.";
    expect(formatText(textCompuclub, columnOptionsCompuclubWithoutCity, 'overal', 'overal', 0)).toEqual(result);
})

test('formats text with source KBDB correctly without city (gemeente)', () => {
    const columnOptionsKbdbWithoutCity = ['plaats', '', '', 'naam', '', '', '', '', '', 'snelheid', ''];
    const result = "1. Name Surname, 1315 m; 2. Name Surname, 1292 m; 3. Name Surname, 1285 m; 4. Name Surname, 1280 m; 5. Name Surname, 1278 m; 6. Name Surname, 1277 m; 7. Name Surname, 1275 m; 8. Name Surname, 1272 m; 9. Name Surname, 1271 m; 10. Name Surname, 1271 m.";
    expect(formatText(textKbdb, columnOptionsKbdbWithoutCity, 'overal', 'overal', 0)).toEqual(result);
})

test('formats text and keeps city and speed on all lines with invalid full text options', () => {
    const result = "1. Name Surname, City, 1315.4126 m; 2. Name Surname, City, 1292.9831 m; 3. Name Surname, City, 1285.4297 m; 4. Name Surname, City, 1280.0502 m; 5. Name Surname, City, 1278.3028 m; 6. Name Surname, City, 1277.3696 m; 7. Name Surname, City, 1275.9706 m; 8. Name Surname, City, 1272.8766 m; 9. Name Surname, City, 1271.6230 m; 10. Name Surname, City, 1271.3305 m.";
    expect(formatText(textKbdb, columnOptionsKbdb, 'invalid', 'invalid', 'invalid')).toEqual(result);
})

test('removes columns for which invalid column options are provided', () => {
    const columnOptions = ['invalid'];
    expect(formatText('text', columnOptions)).toBe('');
})

test('removes columns for which invalid column options are provided and keeps valid ones', () => {
    const columnOptions = ['invalid', 'naam'];
    const result = "John Doe; Emily Lee; David Johnson; Emily Lee; Michael Kim; Sarah Brown; Kevin Davis; Lisa Chen; Adam Nguyen; Sarah Brown.";
    expect(formatText(textCompuclub, columnOptions)).toBe(result);
})