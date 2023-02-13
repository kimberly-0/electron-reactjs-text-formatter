const { containsLowercase } = require('../format');

test('returns true because string is all lowercase letters', () => {
    expect(containsLowercase('hello world')).toBeTruthy();
})

test('returns true because string contains lowercase letters', () => {
    expect(containsLowercase('Hello World')).toBeTruthy();
})

test('returns false because string does not contain lowercase letters', () => {
    expect(containsLowercase('HELLO WORLD')).toBeFalsy();
})

test('returns false because string of numbers does not contain lowercase letters', () => {
    expect(containsLowercase('12345')).toBeFalsy();
})

test('returns false because string of special chars does not contain lowercase letters', () => {
    expect(containsLowercase('@£$%&()-_/')).toBeFalsy();
})

test('returns false because string with spaces does not contain lowercase letters', () => {
    expect(containsLowercase(' ')).toBeFalsy();
})

test('returns false because empty string does not contain lowercase letters', () => {
    expect(containsLowercase('')).toBeFalsy();
})

test('returns false because no param is given', () => {
    expect(containsLowercase()).toBeFalsy();
})
