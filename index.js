const http = require('http')
const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())


morgan.token('body', (req) => {
    const body = JSON.stringify(req.body)
    if (body === JSON.stringify({})) {
        return ''
    }
    else {
        return body
    }
})
app.use(morgan(':method :url :status :req[body] - :response-time ms :body'))



  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
  })
})



app.get("/api/persons/:id", (request, response, next) => {
      Person.findById(request.params.id)
        .then((person) => {
          if (person) {
            response.json(person)
          } else {
            response.status(404).end();
          }
        })
        .catch((error) => next(error))
})
  
 


app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
   })
   .catch(error => next(error))
})


  
  const generateId = () => {
    const  id= Math.floor(Math.random() * 10000)
   return id
   }

   

   app.post('/api/persons', (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    const person = new Person({
        name: request.body.name,
        number: request.body.number,
        id: generateId()
    })

    person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
})



app.put('/api/persons/:id', (req, res, next) => {
  const person = {
      name: req.body.name,
      number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
          res.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const person = {
      name: request.body.name,
      number: request.body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
          response.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.get('/info', (request, response) => {
  Person.find({}).then(results => {
      response.send(`Phonebook has info for ${results.length} people` + "\n" + new Date())
  })
})


  

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
  
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  app.use(errorHandler)
  

  
const PORT = process.env.PORT
app.listen(PORT,() => {
	console.log(`Successfully running on ${PORT}`)
})