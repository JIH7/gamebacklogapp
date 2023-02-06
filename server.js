const { req, res} = require('express')
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8080
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'GameList'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

let gameApiString = process.env.GAME_DB_API_STRING

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', async (req, res)=>{
    const games = await db.collection('GameList').find().toArray()
    res.render('index', {items: games})
})

app.get('/randomGamePage', async (req, res)=>{
    const randomGame = await db.collection('GameList').aggregate([ { $sample: { size: 1 } } ]).toArray()
    const apiRes = await fetch(gameApiString + encodeURI(randomGame[0].game))
    const data = await apiRes.json()
    res.render('gamePage', {gameData: data.results[0]})
})

app.get('/gamePage', async (req, res)=>{
    const game = req.query.name
    const apiRes = await fetch(gameApiString + game)
    const data = await apiRes.json()
    res.render('gamePage', {gameData: data.results[0]})
})

app.post('/addGame', (req, res) =>{
    db.collection('GameList').insertOne({game: req.body.gameName})
    .then(result =>{
        console.log('Game added')
        res.redirect('/')
    })
    .catch(error => console.log(error))
})

app.delete('/deleteItem', (req, res) => {
    db.collection('GameList').deleteOne({game: req.body.itemFromJS})
    .then(result =>{
        res.json('Game Deleted')
    })
    .catch(error => console.log(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})