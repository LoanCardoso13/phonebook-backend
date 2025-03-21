const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

const persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

const isMissingInfo = person => {
  return !person.name || !person.number;
}

const isRepeated = person => {
  return persons.map(person => person.name).includes(person.name);
}

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  if (persons.map(person => person.id).includes(id)) {
    const person = persons.filter(person => person.id === id)[0]
    response.send(`<p>Name: ${person.name}</p>
                   <p>Number: ${person.number}</p>`);
  } else {
    response.status(404).end();
  }
})

app.post('/api/persons', (request, response) => {
  const newId = Math.floor(Math.random() * 1000000);
  const newPerson = request.body;

  if (isMissingInfo(newPerson)) {
    return response.status(400).json({error: 'missing personal information'})
  } else if (isRepeated(newPerson)) {
    return response.status(400).json({error: 'this one already exists!'})
  }

  newPerson.id = newId;
  persons.push(newPerson);
  response.json(newPerson);
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  if (persons.map(person => person.id).includes(id)) {
    const filteredPersons = persons.filter(person => person.id !== id);
    persons.length = 0;
    persons.push(...filteredPersons);
  }
  response.status(204).end();
})

app.get('/info', (request, response) => {
  const page  = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>`
  response.send(page);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
