var checkQuestion = function validateQuestion(data) {
  //Validate New Question
  var errorsQ = []
  //Title
  if (!data.title || typeof data.title == undefined || data.title == null) {
    errorsQ.push({ text: 'Título inválido' })
  } else if (data.title.length < 2) {
    errorsQ.push({ text: 'Título muito pequeno' })
  }

  //Content
  if (
    !data.questionContent ||
    typeof data.questionContent == undefined ||
    data.questionContent == null
  ) {
    errorsQ.push({ text: 'Pergunta inválida' })
  }

  //Slug
  if (!data.slug || typeof data.slug == undefined || data.slug == null) {
    errorsQ.push({ text: 'Slug inválida' })
  }

  //Category
  if (data.category == '0') {
    errorsQ.push({ text: 'Categoria inválida, registre uma categoria' })
  }

  return errorsQ
}

module.exports = checkQuestion
