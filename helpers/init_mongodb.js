const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DBNAME, 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    }).then(() => {
    console.log('mongodb connected')
}).catch((err) => {console.log(err.message)})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
});

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from db')
})

process.on('SIGINT', async() => {
    await mongoose.connection.close();
    process.exit(0)
})