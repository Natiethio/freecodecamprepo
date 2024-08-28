require('dotenv').config() 
let express = require('express');
const bodyParser = require('body-parser')
let app = express();

let status = process.env.MESSAGE_STYLE

app.use(function(req, res, next) {
    const method = req.method;
    const path = req.path;
    const ip = req.ip;

    console.log(`${method} ${path} - ${ip}`);
    next();
});


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/views/index.html");
  });

app.use("/public", express.static(__dirname + "/public"));

app.use(express.static('public'));
app.get("/:word/echo" , (req,res) =>{
 const word = req.params.word;
 res.json({ echo: word });
})

app.get("/json" , (req,res) =>{
    if(process.env.MESSAGE_STYLE == "uppercase"){
     res.json({"message": "HELLO JSON"})
    }
    else{
     res.json({"message": "Hello json"}) 
    }
})

app.route("/name")
 .get((req,res)=>{
    const firstname = req.query.first
    const lastname = req.query.last
    res.json({name : `${firstname} ${lastname}`})
})
.post((req,res)=>{
    const firstname = req.body.first
    const lastname = req.body.last

    res.json({name : `${firstname} ${lastname}`})
})

 module.exports = app;
