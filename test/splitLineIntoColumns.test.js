const { splitLineIntoColumns } = require('../format');

const textLineCompuclub = "     1  Name Surname   City           1862   49/25   2-8507195    49   405,420  15.49.45  1399,206  1000,0  00:00:00 ";
const resultCompuclub = ["1", "Name Surname", "City", "1862", "49/25", "2-8507195", "49", "405,420", "15.49.45", "1399,206", "1000,0", "00:00:00"];

const textLineKbdb = "1	1	302691-51	NAME SURNAME	CITY	492337	1 - 8/10	BE-19-2132563	1 - 13:29:17	1315.4126	0.0049";
const resultKbdb = ["1", "1", "302691-51", "NAME SURNAME", "CITY", "492337", "1 - 8/10", "BE-19-2132563", "1 - 13:29:17", "1315.4126", "0.0049"];

test('returns Compuclub text line with source Compuclub (split up with spaces) as an array of columns', () => {
    expect(splitLineIntoColumns(textLineCompuclub, 'compuclub')).toHaveLength(12)
    expect(splitLineIntoColumns(textLineCompuclub, 'compuclub')).toStrictEqual(resultCompuclub);
})

test('returns KBDB text line with source KBDB (split up with tab) as an array of columns', () => {
    expect(splitLineIntoColumns(textLineKbdb, 'kbdb')).toHaveLength(11)
    expect(splitLineIntoColumns(textLineKbdb, 'kbdb')).toStrictEqual(resultKbdb);
})

test('returns Compuclub text line with INVALID source as an array of columns', () => {
    expect(splitLineIntoColumns(textLineCompuclub, 'invalid')).toHaveLength(12)
    expect(splitLineIntoColumns(textLineCompuclub, 'invalid')).toStrictEqual(resultCompuclub);
})

test('returns KBDB text line with INVALID source as an array of columns', () => {
    expect(splitLineIntoColumns(textLineKbdb, 'invalid')).toHaveLength(11)
    expect(splitLineIntoColumns(textLineKbdb, 'invalid')).toStrictEqual(resultKbdb);
})
