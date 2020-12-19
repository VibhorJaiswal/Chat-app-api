//login send recieve signup 

const express = require('express');
const app = express();
const con = require(__dirname + '/db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const cors = require('cors');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

con.connect((err) => {

    if (err) throw err;

    console.log('connected!.......');
});


//To login users
app.post('/login', (req, res) => {


    con.query('select password, id from users where name = ?', [req.body.name], (err, result) => {

        if (err) throw err;


        if (result.length == 0) {
            res.send('Not registered');
            return;
        }


        bcrypt.compare(req.body.password, result[0].password, (err, passAsRes) => {

            if (err) throw err;

            if (passAsRes == true) {
                res.send(`welcome ${req.body.name}`);
                return;
            }
            else
                res.send('wrong pass');
        });
    });
});


//To register users
app.post('/register', (req, res) => {

    const name = req.body.rname;
    //To hash password 
    bcrypt.hash(req.body.rpassword, saltrounds, (err, hashedpass) => {

        //To generate user id
        bcrypt.hash(req.body.rname, saltrounds, (err, hashedid) => {

            con.query('insert into users (name, password, id) values (?, ?, ?)', [name, hashedpass, hashedid], (err, result) => {

                if (err.code == 'ER_DUP_ENTRY') {
                    res.send('Username taken');
                    return;
                }
                else if (err) throw err;

                res.send('Registered');
            });
        });

    });

});

//To send messages
app.post('/msg', (req, res) => {

    const id_1 = req.body.id_1;
    const id_2 = req.body.id_2;
    const msg = req.body.msg;
    const time = req.body.time;
    con.query('insert into messages (id_1, id_2, msg, dateAndTime) values (?, ?, ?, ?)', [id_1, id_2, msg, time], (err, result) => {

        if (err) throw err;
        console.log(result);

        if (result.affectedRows == 1) {
            res.send('Sent.......');
            return;
        }
        res.send(result);
    });

});


//To get user messages 
app.post('/getMsg', (req, res) => {

    const id_1 = req.body.id_1g;
    const id_2 = req.body.id_2g;

    con.query('select msg, dateAndTime from messages where id_1 = ? and id_2 = ? limit ?', [id_1, id_2, 50], (err, result) => {

        if (err) throw err;

        if (result.length == 0) {
            res.send('Start conversation.....');
            return;
        }

        res.send(result);


    });
});


app.listen(3000, () => {
    console.log('listen at port 3000');
});

