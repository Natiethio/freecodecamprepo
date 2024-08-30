const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
let PORT = process.env.PORT

app.use(cors())

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

console.log(PORT)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  }
})

const exerciseSchema = new mongoose.Schema({
  userId:{
    type : String,
    required : true
  },
  description:{
    type : String,
    required : true
  },
  duration:{
    type : Number,
    required : true
  },
  date:{
    type : Date,
    required : true
  }
})

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exerciseSchema)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
.post( async (req,res)=>{
  const username = req.body.username
  const newUser = new User({username : username})
  await newUser.save()
  res.json({username : newUser.username , _id : newUser._id })
})
.get( async(req,res)=>{
  const user = await User.find()
  res.json({user})
})

app.post('/api/users/:id/exercises', async(req,res) =>{
  const { id } = req.params;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date

  console.log(description)
  console.log(duration)
  console.log(date)

  
  const finduser = await User.findById(id)
  if (!finduser) return res.status(404).send('User not found');
   
  console.log(finduser.username)
  const exercise = new Exercise({
    userId : id,
    description : description,
    duration : duration,
    date: date ? new Date(date) : new Date(),
  })

  await exercise.save()

  res.json({
    username: finduser.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
    _id: finduser._id
  });
})

app.get('/api/users/:id/logs', async (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;

  const user = await User.findById(id);
  if (!user) return res.status(404).send('User not found');

  let exercises = await Exercise.find({ userId: id });

  if (from) exercises = exercises.filter(e => new Date(e.date) >= new Date(from));
  if (to) exercises = exercises.filter(e => new Date(e.date) <= new Date(to));
  if (limit) exercises = exercises.slice(0, parseInt(limit));

  res.json({
    username: user.username,
    count: exercises.length,
    _id: user._id,
    log: exercises.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString(),
    }))
  });
});


const listener = app.listen(PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
