const path = require('path')
const multer = require('multer');
const crypto = require('crypto');

// biblioteca multer = lida com o upload de arquivos. Ela fornece uma maneira fácil de lidar com o recebimento de arquivos do cliente no lado do servidor. 


// obtém caminhos absolutos
const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp');
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

// objeto de configuração do MULTER
const MULTER = {
  // define o tipo de armazenamento
  storage: multer.diskStorage({
    // diretório de destino p/salvar os arqs
    destination: TMP_FOLDER,
    // função p/definir o nome do arquivo
    filename(req, file, callback){
      // gera um hash aleatório
      const fileHash = crypto.randomBytes(10).toString('hex');
      // combina o hash com o nome do arquivo
      const fileName = `${fileHash}-${file.originalname}`;

      // retorna um erro (se houver) e o nome do arquivo
      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER
}