require('dotenv').config();
//require('mongoose')
const mongoose = require('mongoose');

console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));
let Person;

const personSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   age:Number,
   favoriteFoods: [String]
})

Person = mongoose.model('Person', personSchema)

const createAndSavePerson = (done) => {
  const newPerson = new Person({
    name: "Natnael Berhanu",
    age: 23,
    favoriteFoods: ["Pasta", "Dinich", "Gomen"]
  })

  newPerson.save((err, data)=> {
    if (err) return console.error(err);
    console.log("Person saved successfully:", data);
    done(null, data)
  })
};

var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err,data)=>{
    if (err) return console.error(err);
    console.log("Peoples Saved Succesfully",data)
    done(null , data);
  })
  
};

const findPeopleByName = (personName, done) => {
  Person.find({name : personName}, (err , personfind)=>{
    if(err) console.error(err)
     console.log("User found in this name is",personfind)
     done(null , personfind);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, person)=>{
    if(err) console.error(err)
    console.log("User found in this food is", person)
    done(null , person);
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, (err, person)=>{
    if(err) console.error(err)
    console.log("User found in this id is", person)
    done(null , person);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person)=>{

    person.favoriteFoods.push(foodToAdd)

    person.save((err , updateduser)=>{
      if(err) console.error(err)
      console.log("Updated User Data is", updateduser)
      done(null , updateduser);
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet} , { new: true }, (err, updatedata) => {
    if(err) console.error(err)
    console.log("Updated user data is", updatedata)
    done(null , updatedata);
  })
};

const removeById = (personId, done) => {
  // Person.findByIdAndRemove(personId, (err, removed) => {
  //   if(err) console.error(err)
  //   console.log("User Deleted")
  //   done(null , removed);
  // })

  Person.findOneAndRemove({_id: personId}, (err, removed) => {
    if(err) console.error(err)
    console.log("User Deleted")
    done(null , removed);
   })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary"; // delete all user called Mary

  Person.remove({name: nameToRemove}, (err, removed)=>{
    if(err) console.error(err)
    console.log("Users Deleted")
    done(null , removed);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch }) // Find people who like the food
    .sort({ name: 1 }) // Sort by name in ascending order
    .limit(2) // Limit the results to 2 documents
    .select({ age: 0 }) // Exclude the age field
    .exec((err, searchresult) => { // Execute the query
      if (err) return console.error(err);
      done(null, searchresult);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
