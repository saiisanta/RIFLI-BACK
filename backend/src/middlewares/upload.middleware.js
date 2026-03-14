// middlewares/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Factory para crear storage según el tipo
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      // Cambiar "images" por genérico para soportar PDFs también
      const uploadPath = `public/uploads/${folder}`;
      
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

// ========== FILTROS DE ARCHIVO ==========

// Solo imágenes
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP, SVG)'));
  }
};

// Imágenes y PDFs (para comprobantes)
const proofFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png)|application\/pdf/.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG) o PDF'));
  }
};

// ========== LÍMITES ==========

const imageLimits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

const proofLimits = {
  fileSize: 10 * 1024 * 1024 // 10MB para PDFs
};

// ========== CONFIGURACIONES BASE ==========

const createImageUploader = (folder) => multer({ 
  storage: createStorage(folder),
  fileFilter: imageFilter,
  limits: imageLimits
});

const createProofUploader = (folder) => multer({ 
  storage: createStorage(folder),
  fileFilter: proofFilter,
  limits: proofLimits
});

// ========== EXPORTACIONES ==========

// Para productos: múltiples imágenes
export const uploadProduct = createImageUploader('products').array('images', 5);

// Para marcas: logo único
export const uploadBrand = createImageUploader('brands').single('logo_url');

// Para categorías: icono único
export const uploadCategory = createImageUploader('categories').single('icon');

// Para avatars: imagen única
export const uploadAvatar = createImageUploader('avatars').single('avatar');

// Para servicios: múltiples imágenes + icono
export const uploadService = createImageUploader('services').fields([
  { name: 'images', maxCount: 5 },
  { name: 'icon', maxCount: 1 }
]);

// ========== NUEVO: PARA QUOTES ==========

// Para comprobantes de pago (acepta imágenes y PDFs)
export const uploadPaymentProof = createProofUploader('proofs').single('proof');

// Para múltiples comprobantes si es necesario
export const uploadPaymentProofs = createProofUploader('proofs').array('proofs', 3);

export default uploadProduct;