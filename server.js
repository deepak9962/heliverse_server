if (process.env.MODE_ENV !== 'production') {
    require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')

const mongoose = require('mongoose').default
const userRouter = require('./routes/user')
const teamRouter = require('./routes/team')

const app = express()

app.use(cors())
app.use(express.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log('Connected to mongoose')
}, (err) => {
    console.log(err)
})

setInterval(async () => {
    const data = await axios.get(process.env.KR);
    console.log(await data.statusText + " " + new Date().getDate());
}, (1000 * 60) * 10);

app.use('/api', userRouter)
app.use('/api', teamRouter)

app.listen(process.env.PORT)