const express = require('express');
const bodyParser = require('body-parser');
const FootballData = require('./footballSchema');
const dbconnection=require('./dbconnection');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

dbconnection;
app.get('/', (req,res)=>{
    res.send('welcome to Football rest api');
})
//1.5
app.post('/add', (req,res)=>{
    const {Team, GamesPlayed, Win, Draw,Loss,GoalsFor,GoalsAgainst,Points,Year}=req.body;
    const doc1 = new FootballData({ 
        Team:"jacky",
        GamesPlayed:45, 
        Win:5,
        Draw:8, 
        Loss:0, 
        GoalsFor:7, 
        GoalsAgainst:0, 
        Points:8, 
        Year:2022 });
    // adding one document in the collection
    doc1
     .save()
     .then((doc1) => {
        res.send("New Article Has been Added Into Your DataBase.",doc1);
     })
     .catch((err) => {
     console.error(err);
     res.send({error:'failed to add data'});
     });
} );
//1.6
app.post('/update', (req, res) => {
    const {Team, GamesPlayed, Win, Draw,Loss,GoalsFor,GoalsAgainst,Points,Year}=req.body;
    const data = FootballData.updateMany({Team: "japan"},{$set:{Win: 10}});
    data
        .then((data)=>{
        res.send('updated:', data);
        })
        .catch((err)=>{
        console.error('error updating data:',err);
        })
});
//1.7
app.post('/delete',(req,res)=>{
    const data= FootballData.deleteOne({Team:'japan'});

    data
        .then((data)=>{
        res.send('Delete result: ',result)
        })
        .catch((err)=>{
        console.log('error deleting data:',err);
        })
});
//1.8
app.get('/Totalgames/:Year', (req, res) => {
    const { Year } = req.params;

    FootballData.aggregate([
        { $match: { Year: parseInt(Year) } },
        {
            $group: {
                _id: null,
                totalGamesPlayed: { $sum: "$Games Played" },
                totalWin: { $sum: "$Win" },
                totalDraw: { $sum: "$Draw" },
            },
        },
    ])
        .then((Totalgames) => res.send({ Year, Totalgames }))
        .catch((error) => res.send({ message: error.message }));
});
//1.9
app.get('/wins/:value', (req, res) => {
    const { value } = req.params;

    FootballData.find({ Win: { $gt: parseInt(value) } })
        .limit(10)
        .then((records) => res.send(records))
        .catch((error) => res.send({ message: error.message }));
});
//2.0
app.get('/avg-goals/:Year', (req, res) => {
    const { Year } = req.params;

    FootballData.aggregate([
        { $match: { Year: parseInt(Year) } },
        {
            $group: {
                _id: "$team",
                avgGoalsFor: { $avg: "$Goals For" },
            },
        },
    ])
        .then((records) => res.send(records))
        .catch((error) => res.send({ message: error.message }));
});

app.listen(4000,function(){
    console.log('server is running on port 4000')
})