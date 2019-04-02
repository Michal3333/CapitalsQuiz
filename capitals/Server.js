const rp = require('request-promise');
const $ = require('cheerio');
const express = require('express');
const app = express()
const PORT = 8080;
const cors = require('cors');
let numberOfAnwers = 4;
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

const url = 'https://sciencestruck.com/european-capitals-list';
const asia = 'https://sciencetrends.com/list-of-asian-countries-and-capitals/';

let Countris = [];
let Asia = [];
let Europe = [];
rp(url)
    .then(function (sorce) {
        let temp = $('tr td', sorce);
        for(let i = 2; i < 102; i+=2){
            Europe.push(
                {
                    'country': temp[i].children[0].data,
                    'capital': temp[i+1].children[0].data
                }
            )
        }
        console.log("done")
        Countris = Europe;
    })
    .catch(function (sorce) {
        console.log("xcxc")
    })

rp(asia)
    .then(function (sorce) {
        let temp = $('.content-inner tr td', sorce);
        for(let i = 3; i < 151; i+=3){
            console.log(temp[i].children[0].data + ' ' + temp[i+1].children[0].data);
            Asia.push(
                {
                    'country': temp[i].children[0].data,
                    'capital': temp[i+1].children[0].data
                }
            )
        }
        console.log(Asia.length)
        console.log("done")
    })
    .catch(function (sorce) {
        console.log("xcxc")
    })

function getRandomNumbers(len, amount) {
    let numbers = []
    while(numbers.length < amount){
        let random = Math.floor(Math.random() * (len));
        if(numbers.indexOf(random) === -1) numbers.push(random)
    }
    console.log(numbers)
    return numbers
}
function getQuestion(amount, tab){
    let numbers = getRandomNumbers(tab.length,amount);
    return {
        "question": tab[numbers[0]].country,
        "right": tab[numbers[0]].capital,
        "wrong": numbers.slice(1).map((x) => {
            return tab[x].capital;
        })
    };
}



app.get('/question',(req,res,next) =>{
    res.send(getQuestion(numberOfAnwers, Countris))
});
app.post('/numberOfAnsweres',(req,res,next)=>{
    numberOfAnwers = parseInt(req.body.val);
    console.log(numberOfAnwers)
})
app.post('/region',(req,res,next)=>{
    let region = req.body.val;
    if(region === 'Europe') Countris = Europe;
    else if(region === 'Asia') Countris = Asia;
    console.log(region)
})
app.listen(PORT, () =>{
    console.log("working")
})