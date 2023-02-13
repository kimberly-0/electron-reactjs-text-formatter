const { mergeColumnsIntoLine } = require('../format');

test('merges columns into one line and adds ; if not last line in text)', () => {
    const formattedLineParts = ["1." , "Name Surname", "City", "1315 m"];
    const isNotLastLine = true;
    const result = "1. Name Surname, City, 1315 m;";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('merges columns into one line and adds . if last line in text)', () => {
    const formattedLineParts = ["1." , "Name Surname", "City", "1315 m"];
    const isNotLastLine = false;
    const result = "1. Name Surname, City, 1315 m.";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('merges columns into one line and does not add a special char after . , : or ;', () => {
    const formattedLineParts = ["Hello." , "World:", 'Hello,', "World;"];
    const isNotLastLine = true;
    const result = "Hello. World: Hello, World;";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('returns empty string because all line parts only consist out of whitespace', () => {
    const formattedLineParts = [' ', ' '];
    const isNotLastLine = true;
    const result = "";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('returns empty string because all line parts are empty', () => {
    const formattedLineParts = ['', ''];
    const isNotLastLine = true;
    const result = "";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('returns empty string because no parts params were given', () => {
    const formattedLineParts = [];
    const isNotLastLine = true;
    const result = "";
    expect(mergeColumnsIntoLine(formattedLineParts, isNotLastLine)).toEqual(result);
})

test('returns empty string because empty parts array was given', () => {
    expect(mergeColumnsIntoLine([])).toEqual('');
})

test('returns nothing because no params were given', () => {
    expect(mergeColumnsIntoLine()).toEqual();
})
