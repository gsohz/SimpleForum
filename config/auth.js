const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//User model
require('../models/User')
const User = mongoose.model('users')

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: 'email', passwordField: 'password' },
      (email, password, done) => {
        User.findOne({ email: email }).then(user => {
          if (!user) {
            return done(null, false, { message: 'Esta conta não existe' })
          }

          bcrypt.compare(password, user.password, (err, okay) => {
            if (okay) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'Senha incorreta' })
            }
          })
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
