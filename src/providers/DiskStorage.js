const fs = require('fs');
const path = require('path');
const uploadConfig = require('../configs/upload')

class DiskStorage{
  // método pra mover o arquivo temporário pra pasta pasta final
  async saveFile(file){
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );
    return file;
  }

  // método pra excluir um arquivo da pasta final
  async deleteFile(file){
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try{
      await fs.promises.stat(filePath)
    } catch{
      return;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;

// fs.promises.rename (oldPath, newPath) = é usado pra renomear ou mover um arquivo de um caminho pra outro.

// fs.promises.stat(path) = é usado pra obter informações sobre um arquivo ou diretório no caminho especificado.

// fs.promises.unlink(path) = é usado para excluir um arquivo do caminho especificado