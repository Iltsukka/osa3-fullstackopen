const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
morgan.token('body', req => JSON.stringify(req.body)
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Johnny Deff',
        number: '715473'
    },
    {
        id: 4,
        name: 'Rico Jones',
        number: '343-83465'
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)

})

app.get('/',(req,res) => {
    res.send('<h1>Hello world</h1>')
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <div>${date}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
    
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res)=> {
    
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
    
})

app.post('/api/persons/', (req, res) => {
    
    const person = req.body
    const id = () => Math.floor(Math.random()*(100000-5)+5)
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.some(person=> person.name === req.body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const data = {
        id: id(),
        name: person.name,
        number: person.number
    }
    persons = persons.concat(data)
    res.json(data)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})