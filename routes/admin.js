const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Question')
require('../models/Category')
const Category = mongoose.model('categories')
const { accountType } = require('../src/helpers/accountType')

//Routes

//Category List Admin Route
router.get('/categoria/lista', accountType, (req, res) => {
  Category.find()
    .sort('-date')
    .then(categories => {
      res.render('admin/categoryListAdm', {
        categories: categories.map(Category => Category.toJSON())
      })
    })
    .catch(err => {
      req.flash(
        'error_msg',
        'Houve um erro ao carregar a lista de perguntas, tente novamente!'
      )
      res.redirect('/')
    })
})

//Category Edit Admin Route
router.get('/editar-categoria/:id', accountType, (req, res) => {
  Category.findOne({ _id: req.params.id })
    .lean()
    .then(category => {
      res.render('admin/editCategory', { category: category })
    })
    .catch(err => {
      req.flash('err_msg', 'Esta categoria não existe')
    })
})
//Save Edit
router.post('/categoria/edit', accountType, (req, res) => {
  Category.findOne({ _id: req.body.id })
    .then(category => {
      const validateEditCategory = require('../src/helpers/validateEditCategory')
      var errorsEC = validateEditCategory(req.body)

      if (errorsEC.length > 0) {
        Category.findOne({ _id: req.body.id })
          .lean()
          .then(category => {
            res.render('./admin/editCategory', {
              category: category,
              errorsEC: errorsEC
            })
          })
      } else {
        category.name = req.body.name
        category.tag = req.body.tag

        category
          .save()
          .then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/categoria/lista')
          })
          .catch(err => {
            req.flash('error_msg', 'Erro ao salvar categoria')
          })
      }
    })
    .catch(err => {
      req.flash('error_msg', 'Houve um erro ao editar a categoria')
      res.redirect('/categoria/lista')
    })
})

//Delete Category Data Route
router.post('/lista/deletar-categoria', accountType, (req, res) => {
  Category.deleteOne({ _id: req.body.idCategory })
    .then(() => {
      req.flash('success_msg', 'Categoria deletada com sucesso!')
      res.redirect('/categoria/lista')
    })
    .catch(() => {
      req.flash(
        'error_msg',
        'Ocorreu um erro ao deletar a categoria, tente novamente'
      )
      res.redirect('/categoria/lista')
    })
})

//Export
module.exports = router
