const csv = require('csv-parser');
const fs = require('fs');

const Database = require('better-sqlite3');

const db = new Database('anime.db', {verbose: console.log});

/*let cats = {
    name: '12 стульев',
    name_orig: '12 стульев',
    year: '1976',
    id: '77270',
    url:
        '//kodik.cc/serial/124/80049579d64d1e93d5abb376bb44fdcb/720p'
}*/

const deletesDubleRow = (arr) => {
    let arrJson = JSON.parse(JSON.stringify(arr));
    if (arrJson)
        arr = arrJson.filter((thing, index, self) =>
            index === self.findIndex((t) => (
                t.name === thing.name
            ))
        )
    return arr
}




const searchLink = function (request, res, next) {
    let name = request.params.name;

    const start = new Date().getTime();
    let search = [];
    const getAnime = db.prepare(`SELECT * FROM anime WHERE name LIKE '%${name}%' OR name_orig LIKE '%${name}%' LIMIT 50`); /*const getAnime = db.prepare('SELECT * FROM anime');*/
    for (const row of getAnime.iterate()) {
        search.push(row)
    }
    const end = new Date().getTime();
    console.log(`SecondWay: ${end - start}ms`);

    search = deletesDubleRow(search);

    res.set({"content-type": "application/json; charset=utf-8"});
    res.end(JSON.stringify(search))
};

const serialsAdd = function (request, res, next) {
    const TRUNCATE = db.exec('DROP TABLE IF EXISTS anime');
    const CREATE = db.exec('CREATE TABLE IF NOT EXISTS anime(name text, name_orig text, year text, id int, url text)');
    const insert = db.prepare('INSERT INTO anime (name, name_orig, year, id, url) VALUES (@name, @name_orig, @year, @id, @url)');
let i = 0;
fs.createReadStream('serials.csv')
   .pipe(csv(['name','name_orig','year','id','url','test']))
   .on('data', (row) => {
       row.name = row.name.toLowerCase();
       row.name_orig = row.name_orig.toLowerCase();
       insert.run(row);
       i++;
   })
   .on('end', () => {
       console.log('CSV file successfully processed '+i );
   });

fs.createReadStream('films.csv')
    .pipe(csv(['name','name_orig','year','id','url','test']))
    .on('data', (row) => {
        row.name = row.name.toLowerCase();
        row.name_orig = row.name_orig.toLowerCase();
        insert.run(row);
        i++;
    })
    .on('end', () => {
        console.log('CSV file successfully processed '+i );
    });

 /*   const getAnime = db.prepare('SELECT * FROM anime LIMIT 10');
    for (const row of getAnime.iterate()) {
        console.log(row)
    }
*/
    res.set({"content-type": "application/json; charset=utf-8"});
    res.end("CSV file successfully processed")
};

module.exports = {
    searchLink,
    serialsAdd
};
