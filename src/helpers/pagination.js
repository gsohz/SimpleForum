module.exports = {
  paginatedResults: function (model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = 4

      const startIndex = (page - 1) * limit
      const endIndex = page * limit

      const results = {}

      if (endIndex < (await model.countDocuments().exec())) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model
          .find()
          .limit(limit)
          .skip(startIndex)
          .exec()
        res.paginatedResults = results
        next()
      } catch {
        req.flash('error_msg', 'Falha ao realizar paginação')
      }
    }
  }
}
