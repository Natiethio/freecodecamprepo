require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});


const UrlModel = mongoose.model('URL', urlSchema);

app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;
  const urlObject = new URL(originalUrl);

  dns.lookup(urlObject.hostname, async (err, address, family) => {
    if (err) {
      return res.json({ error: 'invalid URL' });
    }

    const urlCount = await UrlModel.countDocuments({});
    const shortUrl = urlCount + 1;

    const newUrl = new UrlModel({ original_url: originalUrl, short_url: shortUrl });
    await newUrl.save();

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:short_url',async(req,res) => {
  const urlshort = parseInt(req.params.short_url)

  const findurlshort = await UrlModel.findOne({short_url : urlshort})
    try{
      if(findurlshort){
        res.redirect(findurlshort.original_url)
      }
      else{
        res.json({error : 'No shorter short url in the given input'})
      }
    }
    catch(err){
      console.log(err);
      res.json({error : 'server error'})
    }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

