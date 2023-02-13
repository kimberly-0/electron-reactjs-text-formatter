const { splitTextIntoLines } = require('../format');

const { textCompuclub, columnOptionsCompuclub, textKbdb, columnOptionsKbdb } = require('./sampleData');

test('returns text with source Compuclub as an array of text lines', () => {
    const result = [
        "     1  Name Surname   City           1862   49/25   2-8507195    49   405,420  15.49.45  1399,206  1000,0  00:00:00 ",
        "     2  Name Surname   City           1837   24/10   2-2204803    10   401,526  15.48.10  1393,380   998,7  00:01:13 ",
        "     3  Name Surname   City           1862   26/22   2-5089762     1   409,383  15.54.30  1390,094   997,4  00:01:54 ",
        "     4  Name Surname   City           1835   15/10   2-8486550V    2   419,345  16.01.57  1388,788   996,2  00:02:10 ",
        "     5  Name Surname   City           1842   20/6    2-2205332    14   394,086  15.44.33  1384,945   994,9  00:02:59 ",
        "     6  Name Surname   City           1862   49/     2-2207357     6      2     15.54.17  1377,651   993,6  00:04:32 ",
        "     7  Name Surname   City           1859   60/23   2-7077251     2   400,523  15.52.09  1370,948   992,3  00:05:58 ",
        "     8  Name Surname   City           1862   25/15   2-2207326    10   400,162  15.52.05  1370,026   991,1  00:06:10 ",
        "     9  Name Surname   City           1862   48/23   2-2207217    20   400,471  15.52.42  1368,197   989,8  00:06:34 ",
        "    10  Name Surname   City           1835   20/14   2-2204161     2   415,442  16.03.46  1367,633   988,5  00:06:41 "
    ];
    expect(splitTextIntoLines(textCompuclub)).toHaveLength(10)
    expect(splitTextIntoLines(textCompuclub)).toStrictEqual(result);
})

test('returns text with source KBDB as an array of text lines', () => {
    const result = [
        "1	1	302691-51	NAME SURNAME	CITY	492337	1 - 8/10	BE-19-2132563	1 - 13:29:17	1315.4126	0.0049",
        "2	2	304179-84	NAME SURNAME	CITY	451208	1 - 19/23	BE-19-1108128	1 - 13:03:58	1292.9831	0.0098",
        "3	3	187713-18	NAME SURNAME	CITY	513015	1 - 7/7	BE-20-4063769	1 - 13:54:06	1285.4297	0.0147",
        "4	4	306209-77	NAME SURNAME	CITY	493246	1 - 3/6	BE-20-4221159	1 - 13:40:20	1280.0502	0.0195",
        "5	5	241135-90	NAME SURNAME	CITY	470245	1 - 5/21	BE-20-1053592	1 - 13:22:52	1278.3028	0.0244",
        "6	6	218879-47	NAME SURNAME	CITY	453892	1 - 3/7	BE-20-1106062	1 - 13:10:20	1277.3696	0.0293",
        "7	7	301027-36	NAME SURNAME	CITY	495268	1 - 15/124	BE-19-3119219	1 - 13:43:09	1275.9706	0.0342",
        "8	8	301641-68	NAME SURNAME	CITY	554953	1 - 36/36	BE-20-5037093	1 - 14:30:59	1272.8766	0.0391",
        "9	9	255981-95	NAME SURNAME	CITY	502609	1 - 6/13	BE-20-4004125	1 - 13:50:15	1271.6230	0.0440",
        "10	10	301027-36	NAME SURNAME	CITY	2	1 - 2/124	BE-19-4184174	1 - 13:44:34	1271.3305	0.0489"
    ];
    expect(splitTextIntoLines(textKbdb)).toHaveLength(10)
    expect(splitTextIntoLines(textKbdb)).toStrictEqual(result);
})

test('returns string with whitespace as an empty array', () => {
    expect(splitTextIntoLines(' ')).toHaveLength(0)
    expect(splitTextIntoLines(' ')).toStrictEqual([]);
})

test('returns empty string as an empty array', () => {
    expect(splitTextIntoLines('')).toHaveLength(0)
    expect(splitTextIntoLines('')).toStrictEqual([]);
})


test('returns empty array because no params were given', () => {
    expect(splitTextIntoLines()).toHaveLength(0)
    expect(splitTextIntoLines()).toStrictEqual([]);
})
