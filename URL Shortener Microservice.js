require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Basic Configuration
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

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Define your URL schema
const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

// Rename the model to avoid conflicts with the global URL object
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

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
