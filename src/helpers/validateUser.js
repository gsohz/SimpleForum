var checkUser = function validateUser(data) {
  //Validate New User
  var errorsU = []
  //Username
  if (
    !data.nickName ||
    typeof data.nickName == undefined ||
    data.nickName == null
  ) {
    errorsU.push({ text: 'Nome inválido' })
  } else if (data.nickName.length < 3) {
    errorsU.push({ text: 'Nome muito pequeno' })
  }

  //Password
  if (
    !data.password ||
    typeof data.password == undefined ||
    data.password == null
  ) {
    errorsU.push({ text: 'Senha inválida' })
  } else if (data.password.length < 3) {
    errorsU.push({ text: 'Nome muito pequeno' })
  } else if (data.password != data.passwordConfirm) {
    errorsU.push({ text: 'As senhas são diferentes, tente novamente' })
  }

  return errorsU
}

module.exports = checkUser
