
var express = require('express');
var app = express();

 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204


app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});



app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date_string
  let date

  if(!dateString){
    date = new Date()
  }
  else if(!isNaN(dateString)){
   data = new Date(parseInt(dateString))
  }
  else{
    date = new Date(dateString)
  }

  if(date.toString() == "Invalid Date"){
    res.json({error : "Invalid Date" })
  }
  else{
    res.json({unix : date.getTime(), utc : date.toUTCString()})
  }
  
})

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
