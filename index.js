const bodyParser = require('body-parser')
const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db')
const app = express()
connectDB()
const handlebars = require('express-handlebars')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const moment = require('moment')
const user = require('./routes/user')
const passport = require('passport')

//Configs
//Session
require('./config/auth')(passport)
app.use(
  session({
    secret: 'segredodesessaopraprotecao',
    resave: true,
    saveUninitialized: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//Midleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

//Template Engine Handlebars
const hbs = handlebars.create({
  defaultLayout: 'main',
  helpers: {
    formatDate: date => {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    limitContent: limit => {
      if (limit) {
        if (limit.length > 510) {
          return limit.substring(0, 510) + '...'
        }
        return limit
      }
    },
    compare: (author, user, type, options) => {
      if (author == user || type == 1) {
        return options.fn(this)
      } else {
        return options.inverse(this)
      }
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/admin', admin)
app.use('/', user)

//Others
const port = 8081
app.listen(port, () => {
  console.log(`Servidor está no ar na porta ${port}!`)
})
