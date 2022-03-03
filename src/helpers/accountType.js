module.exports = {
  accountType: function (req, res, next) {
    if (req.isAuthenticated() && req.user.accountType == 1) {
      return next()
    }
    req.flash('error_msg', 'Você precisa ser administrador para acessar')
    res.redirect('/')
  }
}
