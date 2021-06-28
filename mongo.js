const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@phoneback.bpa12.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


.then(() => {
    console.log("connected!!!")
    }).catch((error) => {
    console.log(error)})


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv[3] && process.argv[4]){
	const name = process.argv[3]
	const number = process.argv[4]
	const person = new Person({
		name: name,
		number: number
	}) 

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

else{

	Person.find({}).then(results => {
        console.log('phonebook:')
        results.forEach(result => {
            console.log(`${result.name} ${result.number}`)
        })
        mongoose.connection.close()
    })

}  







// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })