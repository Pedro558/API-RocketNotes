// the purpose of this file is to assure that the table will be created even if has been deleted

const sqliteConnection = require('../sqlite')
const createUsers = require('./createUsers')

async function migrationsRun(){
  const schemas = [createUsers].join('')

  sqliteConnection()
    .then(db => db.exec(schemas))
    .catch(error => console.error(error))
} 

module.exports = migrationsRun