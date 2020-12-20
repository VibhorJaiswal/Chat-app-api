const mysql = require('mysql');


const con = mysql.createConnection({

    host: 'db4free.net',
    port: 3306,
    user : 'chatappsql',
    password: 'chatappsql',
    database: 'chatappsql'
});

module.exports = con;