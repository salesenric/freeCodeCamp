const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.error("MongoDB connection error:", err));

var personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number, 
  favoriteFoods: [String]
});

var Person = mongoose.model('Person', personSchema);

// Function to create and save a person
var createAndSavePerson = function(done) {
  // Create a new instance of Person
  var person = new Person({
    name: "Abc",
    age: "20",
    favoriteFoods: ["rice", "chicken", "apple"]
  });

  // Save the document instance to the database
  person.save(function(err, data) {
    if (err) return done(err);  // If there's an error, call done with the error
    done(null, data);           // If successful, call done with the saved data
  });
};

/*
createAndSavePerson("Alice", 28, ["Sushi", "Ice Cream"], (err, person) => {
  if (err) {
    console.error("Error saving person:", err);
  } else {
    console.log("Person saved successfully:", person);
  }
});
*/

/*
const arrayOfPeople = [
  { name: 'John', age: 25, favoriteFoods: ['Pizza', 'Burger'] },
  { name: 'Jane', age: 30, favoriteFoods: ['Pasta', 'Salad'] },
  { name: 'Mike', age: 20, favoriteFoods: ['Sushi', 'Steak'] }
];
*/

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

// const personName='John';

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

// const food='Sushi';

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

// const personId=1;

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // Find the person by their _id
  Person.findById(personId, (err, person) => {
    if (err) return done(err); // Handle any error
    
    // Add "hamburger" to the favoriteFoods array
    person.favoriteFoods.push(foodToAdd);
    
    // Mark the 'favoriteFoods' field as modified if necessary (for mixed types)
    person.markModified('favoriteFoods');
    
    // Save the updated person
    person.save((err, updatedPerson) => {
      if (err) return done(err); // Handle any error during saving
      done(null, updatedPerson); // Return the updated person
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({ name: personName },{ age: ageToSet },{ new: true }, (err, updatedPerson) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, updatedPerson); // If successful, pass the result to the done callback
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, people) => {
    if (err) return done(err); // If there's an error, pass it to the done callback
    done(null, people); // If successful, pass the result to the done callback
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) return done(err);
      done(null, data);
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
