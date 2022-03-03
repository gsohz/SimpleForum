var checkEditCategory = function validateEditCategory(data) {
  //Validate New Category
  var errorsEC = []
  //Category
  if (!data.name || typeof data.name == undefined || data.name == null) {
    errorsEC.push({ text: 'Categoria inválida' })
  } else if (data.name.length < 2) {
    errorsEC.push({ text: 'Categoria muito pequena' })
  }

  //Tag
  if (!data.tag || typeof data.tag == undefined || data.tag == null) {
    errorsEC.push({ text: 'Tag inválida' })
  }

  return errorsEC
}

module.exports = checkEditCategory
