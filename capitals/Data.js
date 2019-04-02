const rp = require('request-promise');
const $ = require('cheerio');
export let Countris = [];
export let Asia = [];
const url = 'https://sciencestruck.com/european-capitals-list';
const asia = 'https://sciencetrends.com/list-of-asian-countries-and-capitals/';
rp(url)
    .then(function (sorce) {
        let temp = $('tr td', sorce);
        for(let i = 2; i < 102; i+=2){
            // console.log(temp[i].children[0].data + ' ' + temp[i+1].children[0].data);
            Countris.push(
                {
                    'country': temp[i].children[0].data,
                    'capital': temp[i+1].children[0].data
                }
            )
        }
        // console.log(Countris.length)
        console.log("done")
    })
    .catch(function (sorce) {
        console.log("xcxc")
    })

rp(asia)
    .then(function (sorce) {
        let temp = $('.content-inner tr td', sorce);
        // console.log(temp[151].children[0].data)
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
