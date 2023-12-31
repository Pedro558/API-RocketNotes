const AppError = require("../utils/AppError")
const { hash, compare } = require('bcrypt')
const UserRepository = require('../repositories/UserRepository')

const sqliteConnection = require('../database/sqlite')
const UserCreateService = require('../services/UserCreateService')

class UsersController {
  async index(req, res){
    const database = await sqliteConnection()
    const users = await database.all('SELECT * FROM users')
    return res.json(users)
  }

  async create(req, res){
    const { name, email, password } = req.body
    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password })
    

    return res.status(201).json()
   
  }

  async update(req, res){
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id

    const database = await sqliteConnection()

    const user = await database.get(
      "SELECT * FROM users WHERE id = (?)",
      [user_id]
    )

    if(!user){
      throw new AppError("Usuário não encontrado")
    }

    const userEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    )

    if(userEmail && userEmail.id !== user.id){
      throw new AppError("Este email já está em uso")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (name === '' || email === '') {
      throw new AppError('O usuário/email está vazio')
    }

    if(password && !old_password ){
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if(!password && old_password ){
      throw new AppError("Você precisa informar a senha nova para definir uma nova senha")
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword){
        throw new AppError("A senha não confere")
      }

      user.password = await hash(password, 8)
    }

    await database.run(
      `UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return res.json()
  }
}

module.exports = UsersController