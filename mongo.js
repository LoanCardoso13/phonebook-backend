const mongoose = require('mongoose')

const connect = password => {
  const url = `mongodb+srv://loancardoso1312:${password}@joesfirst.cmtak.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=JoesFirst`;

  mongoose.set('strictQuery',false);

  mongoose.connect(url);
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);


if (process.argv.length === 3) {
  const password = process.argv[2];

  connect(password);

  console.log('phonebook');
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    })
    mongoose.connection.close()
  });

} else if (process.argv.length === 5) {
  const password = process.argv[2];

  connect(password);

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('give password as argument');
  process.exit(1);
}
