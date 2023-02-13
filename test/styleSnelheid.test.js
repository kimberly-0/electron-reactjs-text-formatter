const { styleSnelheid } = require('../format');

test('styleSnelheid without params', () => {
    expect(styleSnelheid()).toEqual('');  // ???????????
})

test('style empty Snelheid column with no param for digits after decimal point', () => {
    expect(styleSnelheid('')).toEqual('');
})

test('style empty Snelheid column', () => {
    const numOfDigitsAfterDecimalPoint = 0;
    expect(styleSnelheid('', numOfDigitsAfterDecimalPoint)).toEqual('');
})

test('style Snelheid column with 0 digits after . decimal point', () => {
    const numOfDigitsAfterDecimalPoint = 0;
    expect(styleSnelheid('1234.5678', numOfDigitsAfterDecimalPoint)).toEqual('1234 m');
})

test('style Snelheid column with 0 digits after , decimal point', () => {
    const numOfDigitsAfterDecimalPoint = 0;
    expect(styleSnelheid('1234,5678', numOfDigitsAfterDecimalPoint)).toEqual('1234 m');
})

test('style Snelheid column with 1 digit after . decimal point', () => {
    const numOfDigitsAfterDecimalPoint = 1;
    expect(styleSnelheid('1234.5678', numOfDigitsAfterDecimalPoint)).toEqual('1234.5 m');
})