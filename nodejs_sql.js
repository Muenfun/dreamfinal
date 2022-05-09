//Open Call Express 
const express = require('express')
const bodyParser = require('body-parser')
 
const mysql = require('mysql');
 
const app = express()
const port = process.env.PORT || 5500;
app.use('/public',express.static('public'))  
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


//---------- view ---------//
app.set('view engine','ejs')

//MySQL Connect phpMyAdmin
    const pool = mysql.createPool({
    connectionLimit : 10,
    connectionTimeout : 20,
    host : 'localhost', //www.google.com/sql or Server IP Address
    user : 'root',
    password : '',
    database : 'final_lottery'  //Connect Database from beers.sql (Import to phpMyAdmin)
})
//GET
app.get('/', (req, res) => { 
    res.render('index')  
})
app.get('',(req, res) => {
 
    pool.getConnection((err, connection) => {  
        if(err) throw err
        console.log("connected id : ?" ,connection.threadId) 
         
        connection.query('SELECT * FROM lottery_lo', (err, rows) => { 
            connection.release();
            if(!err){ 
                obj = { lottery_lo: rows, Error : err}
                res.render('index', obj)
            } else {
                console.log(err)
            }
         }) 
    })
})

app.post('/add',(req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
            const params = req.body
 
                pool.getConnection((err, connection2) => {
                    connection2.query(`SELECT COUNT(id) AS count FROM lottery_lo WHERE id = ${params.id}`, (err, rows) => {
                        if(!rows[0].count){
                            connection.query('INSERT INTO lottery_lo SET ?', params, (err, rows) => {
                                connection.release()
                                if(!err){
                                  
                                    obj = {Error:err, mesg : `Success adding data ${params.name}`}                                   
                                    res.render('add', obj)
                                }else {
                                    console.log(err)
                                    }
                                })           
                        } else {
                           
                           obj = {Error:err, mesg : `Can not adding data ${params.name}`}                           
                           res.render('add', obj)
                            }
                        })
                    })
                })
            })

app.listen(port, () => 
    console.log("listen on port : ?", port)
    )


 