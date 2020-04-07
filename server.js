const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());


var stats=[];

async function getData(){
    const url = "https://www.mohfw.gov.in/";
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
     const page = await browser.newPage();
    await page.goto(url);
    console.log("opened url");
    try{
        for(var i=1;i<50;i++){
            //s.no selector 
            var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(1)`);
            var parsing = await selector.getProperty('innerText');
            var x1 = await parsing.jsonValue();
            let i1 =await parseInt(x1);
            
            //checking till the last value
            if(isNaN(i1)){break}
            
            //checking previously and now i can work with i1
            // console.log(i1)

            //fetch name of states 
            var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(2)`);
            var parsing = await selector.getProperty('innerText');
            var x2 = await parsing.jsonValue();
            let i2 = x2;
            // console.log(x2);


            //fetch number of cases
            var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`);
            var parsing = await selector.getProperty('innerText');
            var x3 = await parsing.jsonValue();
            let i3 =await parseInt(x3);
            // console.log(i3);

            //fetch number of peoples survived 
            var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`);
            var parsing = await selector.getProperty('innerText');
            var x4 = await parsing.jsonValue();
            let i4 =await parseInt(x4);
            // console.log(i4);

            //fetch number of peoples died
            var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`);
            var parsing = await selector.getProperty('innerText');
            var x5 = await parsing.jsonValue();
            let i5 =await parseInt(x5);
            // console.log(i5);

            let obj = {
                "id":i1,
                "name":i2,
                "cases":i3,
                "survived":i4,
                "deaths":i5
                }
             stats.push(obj);
            
        }
    }catch(error){
        console.log(error);
    }
   
    browser.close();
}





app.get('/',(req,res)=>{
    try{
        getData();
        
    }catch(error){
        console.log(error)
    }

    const sendResp = () =>{
        res.status(200).json(stats);
    }

    setTimeout(sendResp,15000);
})



const PORT = process.env.PORT;
app.listen(PORT || 3000)


