import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Factory para crear storage según el tipo
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = `public/images/${folder}`;
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });
};

// Configuración de límites y filtros
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP, SVG)'));
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Exportar diferentes configuraciones
export const uploadProduct = multer({ 
  storage: createStorage('products'),
  fileFilter,
  limits
});

export const uploadBrand = multer({ 
  storage: createStorage('brands'),
  fileFilter,
  limits
});

export const uploadCategory = multer({ 
  storage: createStorage('categories'),
  fileFilter,
  limits
});

export const uploadAvatar = multer({ 
  storage: createStorage('avatars'),
  fileFilter,
  limits
});

// Export por defecto (para compatibilidad)
export default uploadProduct;