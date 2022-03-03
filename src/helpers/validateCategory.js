var checkCategory = function validateCategory(data) {
  //Validate New Category
  var errorsC = []
  //Category
  if (!data.name || typeof data.name == undefined || data.name == null) {
    errorsC.push({ text: 'Categoria inválida' })
  } else if (data.name.length < 2) {
    errorsC.push({ text: 'Categoria muito pequena' })
  }

  //Tag
  if (!data.tag || typeof data.tag == undefined || data.tag == null) {
    errorsC.push({ text: 'Tag inválida' })
  }

  return errorsC
}

module.exports = checkCategory
