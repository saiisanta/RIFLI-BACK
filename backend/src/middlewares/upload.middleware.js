import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración de almacenamiento con multer productos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'public/images/products';
    
    // Crear la carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: timestamp-numeroaleatorio.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
export default upload;