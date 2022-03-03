var checkAnswer = function validateAnswer(data) {
  //Validate New Question
  var errorsA = []

  //Content
  if (
    !data.answerContent ||
    typeof data.answerContent == undefined ||
    data.answerContent == null
  ) {
    errorsA.push({ text: 'Resposta inválida' })
  }

  return errorsA
}

module.exports = checkAnswer
