const http = require('http')
const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')

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


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Mark kolp",
      "number": "38-25-645447524",
      "id": 5
    },
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }) 
  
       
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  
  const generateId = () => {
    const  id= Math.floor(Math.random() * 10000)
   return id
   }

   app.post('/api/persons', (request, response) => {
     // const body = JSON.stringify(request)
     console.log("req",request.body)    

     //  console.log("res",response)

      if (!request.body.name || !request.body.number) {
     return response.status(400).json({
         error: 'content missing'
     })
 }
 
 if (persons.find(person => person.name === request.body.name)) {
       return response.status(404).json({
           error: 'name already exists'
       })
   }
     const person = {
       name: request.body.name,
       number: request.body.number,
       id: generateId()
     }
   
     persons = persons.concat(person)
   
     response.json(person)
   })


  let info = {
    name: "Phonebook has info for 4",
    date:  new Date(),
}

app.get('/info', (request, response) => {
    response.json(info)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)