const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcrypt')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController {
  async create(req, res){
    try{
      const { email, password } = req.body;

      const user = await knex('users').where({email: email}).first();

      const passwordMatched = await compare(password, user.password)

      if(!user || !passwordMatched){
        throw new Error
      }

      const { secret, expiresIn } = authConfig.jwt;

      const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
      })
      
      return res.json({ user, token })

    } catch{
      throw new AppError("Email e/ou senha incorretos")
    }
  }
}

module.exports = SessionsController;