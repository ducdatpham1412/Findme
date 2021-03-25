const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ducdat123',
    database: 'spring'
})

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, () => {
    console.log('Sever created, go go http://localhost:3000/ to go')
})


/**
 * QUERY
 */
app.post('/createDatabase', (req, res) => {
    connection.query("CREATE TABLE IF NOT EXISTS user(Id int auto_increment, Username varchar (30) not null, Password varchar(30) not null, primary key(Id))", (err, result) => {
        if (err) res.send(false)
        else res.send(true)
    })
})

app.post('/allUser', (req, res)=>{
    const username = req.body.username
    const password = req.body.password
    connection.query(
        'SELECT * FROM user WHERE Username=? AND Password=?', [username, password],
        (err, result)=>{
            if (err) console.log(err)
            else res.send(result)
        }
    )
} )
