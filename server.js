const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');


const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "system",
    database: "covid19"
  }
});






///////////////////////////////////////////////////
///      web scrapping starts here              ///
///////////////////////////////////////////////////



async function getData(){
  const url = "https://www.mohfw.gov.in/";
  const browser = await puppeteer.launch({
    args: [
      '--incognito',
    ],
  });
  const page = await browser.newPage();
  await page.goto(url);

  //getting cases
  for(let i=1;i<15;i++){

    let selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(3)`);
    let parsing = await selector.getProperty('textContent');
    let data = await parsing.jsonValue();
    // console.log(parseInt(data));
    let newData = parseInt(data);

     db("stats").where("id",i)
    .update({cases:newData}).then((d)=> { });

  }


  //getting survived
  for(let i=1;i<15;i++){
    
    let selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(4)`);
    let parsing = await selector.getProperty('textContent');
    let data = await parsing.jsonValue();
    // console.log(parseInt(data));
    let newData = parseInt(data);

     db("stats").where("id",i)
    .update({survived:newData}).then((d)=> { });
  }


    //getting deaths 
  for(let i=1;i<15;i++){
    
    let selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5)`);
    let parsing = await selector.getProperty('textContent');
    let data = await parsing.jsonValue();
    // console.log(parseInt(data));
    let newData = parseInt(data);
   
     db("stats").where("id",i)
     .update({deaths:newData}).then((d)=> { });
    

  }


  //getting total number of cases
  var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(31) > td:nth-child(2) > strong`);
  var parsing = await selector.getProperty('textContent');
  var data = await parsing.jsonValue();
  let newData =await parseInt(data);
  // console.log(newData);

   db("stats").where("id","30")
  .update({cases:newData}).then((d)=> { });

  //getting total survived 
  var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(31) > td:nth-child(3) > strong`);
  var parsing = await selector.getProperty('textContent');
  var data = await parsing.jsonValue();
  var newData2 =await parseInt(data);

   db("stats").where("id","30")
  .update({survived:newData2}).then((d)=> { });


  //getting total deaths
  var selector = await page.$(`#state-data > div > div > div > div > table > tbody > tr:nth-child(31) > td:nth-child(4) > strong`);
  var parsing = await selector.getProperty('textContent');
  var data = await parsing.jsonValue();
  var newData3 =await parseInt(data);

   db("stats").where("id","30")
  .update({deaths:newData3}).then((d)=> { });



  await browser.close();
}

























// console.log("first")

// // db('stats').update({cases:400}).where({id:30});

// console.log("last")

// await db("stats").where("id","30")
//   .update({cases: 40333}).then((d)=> { });

// console.log("last 2")



///////////////////////////////////////////////////
///      Data updated here every 12 hr          ///
///////////////////////////////////////////////////


console.log("hello")
setInterval(getData,43200000);




///////////////////////////////////////////////////
///      requests handled below                 ///
///////////////////////////////////////////////////


app.get('/',(req,res)=>{
  
  db.select('*').from('stats')
  .then(data => res.json(data) )
  .catch(err => res.json("error ocuured"))

})


///////////////////////////////////////////////////
///      listening to a port below              ///
///////////////////////////////////////////////////



const PORT = process.env.PORT;

app.listen(PORT || 3000,resp=>{
  console.log("app is running");
});











