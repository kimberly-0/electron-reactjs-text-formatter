const { splitLineIntoColumns } = require('../format');

const textLineCompuclub = "     1  Name Surname   City           1862   49/25   2-8507195    49   405,420  15.49.45  1399,206  1000,0  00:00:00 ";
const resultCompuclub = ["1", "Name Surname", "City", "1862", "49/25", "2-8507195", "49", "405,420", "15.49.45", "1399,206", "1000,0", "00:00:00"];

const textLineKbdb = "1	1	302691-51	NAME SURNAME	CITY	492337	1 - 8/10	BE-19-2132563	1 - 13:29:17	1315.4126	0.0049";
const resultKbdb = ["1", "1", "302691-51", "NAME SURNAME", "CITY", "492337", "1 - 8/10", "BE-19-2132563", "1 - 13:29:17", "1315.4126", "0.0049"];

test('returns Compuclub text line (split up with spaces) as an array of columns', () => {
    expect(splitLineIntoColumns(textLineCompuclub)).toHaveLength(12)
    expect(splitLineIntoColumns(textLineCompuclub)).toStrictEqual(resultCompuclub);
})

test('returns KBDB text line (split up with tab) as an array of columns', () => {
    expect(splitLineIntoColumns(textLineKbdb)).toHaveLength(11)
    expect(splitLineIntoColumns(textLineKbdb)).toStrictEqual(resultKbdb);
})

test('returns space string as an array with one empty string', () => {
    expect(splitLineIntoColumns(' ')).toHaveLength(0)
    expect(splitLineIntoColumns(' ')).toStrictEqual([]);
})

test('returns empty string as an empty array', () => {
    expect(splitLineIntoColumns('')).toHaveLength(0)
    expect(splitLineIntoColumns('')).toStrictEqual([]);
})

test('returns empty array because no params were given', () => {
    expect(splitLineIntoColumns()).toHaveLength(0)
    expect(splitLineIntoColumns()).toStrictEqual([]);
})
