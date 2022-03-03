var checkEditUser = function validateEditUser(data) {
  //Validate New User
  var errorsEU = []

  //Username
  if (!data.name || typeof data.name == undefined || data.name == null) {
    errorsEU.push({ text: 'Nome inválido' })
  } else if (data.name.length < 2) {
    errorsEU.push({ text: 'Nome muito pequeno' })
  }

  //NickName
  if (
    !data.nickName ||
    typeof data.nickName == undefined ||
    data.nickName == null
  ) {
    errorsEU.push({ text: 'Nome inválido' })
  } else if (data.nickName.length < 3) {
    errorsEU.push({ text: 'Nome muito pequeno' })
  }

  //Email
  if (!data.email || typeof data.email == undefined || data.email == null) {
    errorsEU.push({ text: 'Email inválido' })
  }

  return errorsEU
}

module.exports = checkEditUser
