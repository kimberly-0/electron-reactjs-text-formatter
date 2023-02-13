const { capitalizeFirstLetterOfEachWord } = require('../format');

test('capitalizes first letter of each word separated by a space', () => {
    expect(capitalizeFirstLetterOfEachWord('hello world')).toEqual('Hello World');
})

test('capitalizes first letter of each all caps word separated by a space', () => {
    expect(capitalizeFirstLetterOfEachWord('HELLO WORLD')).toEqual('Hello World');
})

test('capitalizes first letter of each word separated by -', () => {
    expect(capitalizeFirstLetterOfEachWord('hello-world')).toEqual('Hello-World');
})

test('capitalizes first letter of each word separated by &', () => {
    expect(capitalizeFirstLetterOfEachWord('hello&world')).toEqual('Hello&World');
})

test('capitalizes first letter of each word separated by /', () => {
    expect(capitalizeFirstLetterOfEachWord('hello/world')).toEqual('Hello/World');
})

test('capitalizes first letter of each word separated by (', () => {
    expect(capitalizeFirstLetterOfEachWord('hello (world)')).toEqual('Hello (World)');
})

test('retains spaces', () => {
    expect(capitalizeFirstLetterOfEachWord(' ')).toEqual(' ');
})

test('returns empty string because of empty string input', () => {
    expect(capitalizeFirstLetterOfEachWord('')).toEqual('');
})

test('returns empty string because no param is given', () => {
    expect(capitalizeFirstLetterOfEachWord()).toEqual('');
})