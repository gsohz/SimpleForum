const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../models/Question')
const Question = mongoose.model('questions')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Answer')
const Answer = mongoose.model('answers')
const { loggedIn } = require('../src/helpers/loggedIn')
const { paginatedResults } = require('../src/helpers/pagination')

//Index Route
router.get('/', (req, res) => {
  Question.find()
    .populate('category')
    .sort('-date')
    .limit(5)
    .then(questions => {
      res.render('user/index', {
        questions: questions.map(Question => Question.toJSON())
      })
    })
    .catch(err => {
      req.flash('error_msg', 'Erro ao carregar postagens recentes')
      res.redirect('/404')
    })
})

//Error Route
router.get('/404', (req, res) => {
  res.send('Erro 404')
})

//User Creation Route
router.get('/registro', (req, res) => {
  res.render('user/register')
})

router.post('/registro/add', (req, res) => {
  const validateUser = require('../src/helpers/validateUser')
  var errorsU = validateUser(req.body)

  if (errorsU.length > 0) {
    res.render('./user/register', { errorsU: errorsU })
  } else {
    User.findOne({ nickName: req.body.nickName })
      .then(nickName => {
        if (nickName) {
          req.flash('error_msg', 'Apelido já está em uso, tente outro')
          res.redirect('/registro')
        } else {
          User.findOne({ email: req.body.email })
            .then(userEmail => {
              if (userEmail) {
                req.flash('error_msg', 'Já existe uma conta com este email')
                res.redirect('/registro')
              } else {
                const newUser = new User({
                  name: req.body.name,
                  nickName: req.body.nickName,
                  email: req.body.email,
                  password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                      req.flash(
                        'error_msg',
                        'Houve um erro durante o salvamento do usuário'
                      )
                      res.redirect('/')
                    }

                    newUser.password = hash

                    newUser
                      .save()
                      .then(() => {
                        req.flash('success_msg', 'Usuário criado com sucesso')
                        res.redirect('/')
                      })
                      .catch(() => {
                        req.flash(
                          'error_msg',
                          'Ocorreu um erro ao criar usuário'
                        )
                        res.redirect('/registro')
                      })
                  })
                })
              }
            })
            .catch(err => {
              'error_msg',
                'Houve um erro interno ao criar usuário, tente novamente'
              res.redirect('/')
            })
        }
      })
      .catch(err => {
        req.flash(
          'error_msg',
          'Houve um erro interno ao criar usuário, tente novamente'
        )
      })
  }
})

//User Login Route
router.get('/login', (req, res) => {
  res.render('user/login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})

//User Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Deslogado com sucesso!')
  res.redirect('/')
})

//User Profile Route
router.get('/perfil', loggedIn, (req, res) => {
  User.find({ _id: req.user._id })
    .lean()
    .then(userData => {
      if (userData) {
        Question.find({ authorId: req.user._id })
          .lean()
          .populate('category')
          .sort('-date')
          .then(question => {
            if (question) {
              Answer.find({ authorId: req.user._id })
                .lean()
                .then(answer => {
                  if (answer) {
                    res.render('user/userProfile', {
                      userData: userData,
                      question: question,
                      answer: answer
                    })
                  } else {
                    res.render('user/userProfile', {
                      userData: userData,
                      question: question
                    })
                  }
                })
                .catch(err => {
                  req.flash(
                    'error_msg',
                    'Houve um erro ao carregar respostas do usuário, tente novamente!'
                  )
                })
            } else {
              res.render('user/userProfile', {
                userData: userData
              })
            }
          })
          .catch(err => {
            req.flash(
              'error_msg',
              'Houve um erro ao carregar perguntas do usuário, tente novamente!'
            )
            res.redirect('/')
          })
      }
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Houve um erro ao carregar o perfil, tente novamente!'
      )
      res.redirect('/')
    })
})

//Edit Profile Route
router.get('/editar-nome/:nickName', loggedIn, (req, res) => {
  User.find({ nickName: req.params.nickName })
    .then(user => {
      if (user) {
        res.render('./user/editUser', {
          id: req.user._id,
          name: req.user.name,
          nickName: req.user.nickName,
          email: req.user.email,
          password: req.user.password
        })
      }
    })
    .catch(() => {
      req.flash('error_msg', 'Houve um erro ao editar')
    })
})
//Save Edit
router.post('/edit-profile', loggedIn, (req, res) => {
  const validateEditUser = require('../src/helpers/validateEditUser')
  var errorsEU = validateEditUser(req.body)

  if (errorsEU.length > 0) {
    res.render('./user/editUser', { errorsEU: errorsEU })
  } else {
    let { id, name, nickName, email } = req.body
    User.findOneAndUpdate(
      { _id: id },
      { $set: { name: name, nickName: nickName, email: email } },
      { returnDocument: 'after' }
    )
      .then(user => {
        if (user) {
          Question.updateMany(
            { authorId: id },
            { $set: { author: nickName } },
            { returnDocument: 'after' }
          )

          Answer.updateMany(
            { authorId: id },
            { $set: { author: nickName } },
            { returnDocument: 'after' }
          )

          req.flash('success_msg', 'Editado com sucesso')
          res.redirect('/perfil')
        } else {
          req.flash('erro_msg', 'Houve um erro ao encontrar usuário')
          res.redirect('/perfil')
        }
      })
      .catch(err => {
        req.flash('erro_msg', 'Houve um erro ao editar usuário')
        res.redirect('/perfil')
      })
  }
})

//Category List Route
router.get('/categoria/lista', (req, res) => {
  Category.find()
    .sort('-date')
    .then(categories => {
      if (req.isAuthenticated()) {
        if (req.user.accountType == 1) {
          res.render('./user/categoryList', {
            categories: categories.map(Category => Category.toJSON()),
            accountType: req.user.accountType
          })
        } else {
          res.render('./user/categoryList', {
            categories: categories.map(Category => Category.toJSON()),
            accountType: req.user.accountType
          })
        }
      } else {
        res.render('./user/categoryList', {
          categories: categories.map(Category => Category.toJSON())
        })
      }
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Houve um erro ao carregar a lista de categorias, tente novamente!'
      )
      res.redirect('/')
    })
})

//Add Category Page Route
router.get('/categoria', loggedIn, (req, res) => {
  res.render('user/addCategory')
})

//Add Category Data Route
router.post('/categoria/add', (req, res) => {
  const validateCategory = require('../src/helpers/validateCategory')
  var errorsC = validateCategory(req.body)

  if (errorsC.length > 0) {
    res.render('./admin/addCategory', { errorsC: errorsC })
  } else {
    //Save Category Creation
    const newCategory = {
      name: req.body.name,
      tag: req.body.tag,
      date: Date.now()
    }

    new Category(newCategory)
      .save()
      .then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso!')
        res.redirect('/categoria/lista')
      })
      .catch(err => {
        req.flash(
          'error_msg',
          'Houve um erro ao criar a categoria, tente novamente!'
        )
        res.redirect('/')
      })
  }
})

//Open Category Route
router.get('/categoria/:tag', (req, res) => {
  Category.findOne({ tag: req.params.tag })
    .lean()
    .then(category => {
      if (category) {
        Question.find({ category: category._id })
          .lean()
          .then(questions => {
            res.render('Category/openCategory', {
              questions: questions,
              category: category
            })
          })
      } else {
        req.flash('Esta categoria não existe')
        res.redirect('/')
      }
    })
    .catch(err => {
      req.flash('error_msg', 'Houve um erro ao carregar lista de categorias')
      res.redirect('/categoria/lista')
    })
})

//Question List Route
router.get(
  '/pergunta/lista',
  loggedIn,
  paginatedResults(Question),
  (req, res) => {
    Question.find()
      .populate('category')
      .sort('-date')
      .lean()
      .then(questions => {
        if (req.isAuthenticated()) {
          if (req.user.accountType == 1) {
            res.render('user/questionList', {
              questions: questions,

              accountType: req.user.accountType
            })
          } else {
            res.render('user/questionList', {
              questions: questions,
              accountType: req.user.accountType
            })
          }
        } else {
          res.render('user/questionList', {
            questions: questions
          })
        }
      })
      .catch(err => {
        req.flash(
          'error_msg',
          'Houve um erro ao carregar a lista de perguntas, tente novamente!'
        )
        res.redirect('/')
      })
  }
)

//Add Question Page Route
router.get('/pergunta', loggedIn, (req, res) => {
  //Get Categories
  Category.find()
    .lean()
    .then(categories => {
      res.render('user/addQuestion', { categories: categories })
    })
    .catch(err => {
      req.flash('error_msg', 'Houve um erro ao carregar categorias')
    })
})

//Add Question Datas Route
router.post('/pergunta/add', (req, res) => {
  //Check Errors
  const validateQuestion = require('../src/helpers/validateQuestion')
  var errorsQ = validateQuestion(req.body)

  if (errorsQ.length > 0) {
    Category.find()
      .lean()
      .then(categories => {
        res.render('./user/addQuestion', {
          categories: categories,
          errorsQ: errorsQ
        })
      })
  } else {
    //Save Question Creation
    const newQuestion = {
      title: req.body.title,
      questionContent: req.body.questionContent,
      date: Date.now(),
      category: req.body.category,
      slug: req.body.slug,
      authorId: req.user._id,
      author: req.user.nickName
    }

    new Question(newQuestion)
      .save()
      .then(() => {
        req.flash('success_msg', 'Pergunta criada com sucesso!')
        res.redirect('/pergunta/lista')
      })
      .catch(err => {
        req.flash(
          'error_msg',
          'Houve um erro interno ao criar a pergunta, tente novamente!'
        )
        res.redirect('/pergunta')
      })
  }
})

//Delete Question Data Route
router.post('/lista/deletar-pergunta', (req, res) => {
  Question.deleteOne({ _id: req.body.idQuestion })
    .then(() => {
      req.flash('success_msg', 'Pergunta deletada com sucesso!')
      res.redirect('/pergunta/lista')
    })
    .catch(() => {
      req.flash(
        'error_msg',
        'Ocorreu um erro ao deletar a pergunta, tente novamente'
      )
      res.redirect('/lista')
    })
})

//Delete Answer Data Route
router.post('/deletar-resposta', (req, res) => {
  Answer.deleteOne({ _id: req.body.idAnswer })
    .lean()
    .then(() => {
      req.flash('success_msg', 'Resposta deletada com sucesso!')
      res.redirect('/perfil')
    })
    .catch(() => {
      req.flash(
        'error_msg',
        'Ocorreu um erro ao deletar a resposta, tente novamente'
      )
      res.redirect('/perfil')
    })
})

//Open Question
router.get('/pergunta/:slug', (req, res) => {
  Question.findOne({ slug: req.params.slug })
    .lean()
    .populate('category')
    .then(question => {
      if (question) {
        Answer.find({ questionID: question._id })
          .lean()
          .then(answers => {
            if (answers) {
              if (req.isAuthenticated()) {
                res.render('./openQuestion/index', {
                  question: question,
                  answers: answers,
                  user: req.user.nickName,
                  accountType: req.user.accountType
                })
              } else {
                res.render('./openQuestion/index', {
                  question: question,
                  answers: answers
                })
              }
            } else {
              res.render('./openQuestion/index', {
                question: question
              })
            }
          })
      } else {
        req.flash('error_msg', 'Esta postagem não existe')
        res.redirect('/')
      }
    })
    .catch(() => {
      req.flash('error_msg', 'Houve um erro interno, tente novamente')
      res.redirect('/')
    })
})

//Add Answer
router.post('/pergunta/:slug/resposta', loggedIn, (req, res) => {
  const validateAnswer = require('../src/helpers/validateAnswer')
  var errorsA = validateAnswer(req.body)

  if (errorsA.length > 0) {
    res.render('./openQuestion/index', { errorsA: errorsA })
  } else {
    Question.findOne({ slug: req.params.slug })
      .lean()
      .populate('category')
      .then(question => {
        const newAnswer = {
          questionID: question._id,
          questionSlug: req.params.slug,
          answerContent: req.body.answerContent,
          date: Date.now(),
          author: req.user.nickName
        }

        new Answer(newAnswer).save().then(() => {
          req.flash('success_msg', 'Resposta criada com sucesso!')
          res.redirect('/pergunta/lista')
        })
      })
      .catch(err => {
        req.flash(
          'error_msg',
          'Houve um erro interno ao criar a resposta, tente novamente!'
        )
        res.redirect('/pergunta/lista')
      })
  }
})

//Search Route
router.post('/pesquisa', (req, res) => {
  let searchTerm = { title: RegExp(req.body.search, 'i') }
  Question.find(searchTerm)
    .lean()
    .populate('category')
    .sort('-date')
    .then(questions => {
      if (questions) {
        if (req.isAuthenticated()) {
          res.render('./user/searchResults', {
            question: questions,
            user: req.user.nickName,
            search: req.body.search
          })
        } else {
          res.render('./user/searchResults', {
            question: questions,
            search: req.body.search
          })
        }
      }
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Houve um erro ao carregar a lista de perguntas, tente novamente!'
      )
      res.redirect('/')
    })
})

module.exports = router
