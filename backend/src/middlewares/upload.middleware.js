// middlewares/upload.middleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Factory para crear storage según el tipo
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
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

// Solo PDFs — para presupuestos generados desde el front
const pdfFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase() === '.pdf';
  const mimetype = file.mimetype === 'application/pdf';
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'));
  }
};

// ========== LÍMITES ==========

const imageLimits  = { fileSize: 5  * 1024 * 1024 }; // 5MB
const proofLimits  = { fileSize: 10 * 1024 * 1024 }; // 10MB
const budgetLimits = { fileSize: 10 * 1024 * 1024 }; // 10MB

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

const createPdfUploader = (folder) => multer({
  storage: createStorage(folder),
  fileFilter: pdfFilter,
  limits: budgetLimits
});

// ========== EXPORTACIONES ==========

export const uploadProduct  = createImageUploader('products').array('images', 5);
export const uploadBrand    = createImageUploader('brands').single('logo_url');
export const uploadCategory = createImageUploader('categories').single('icon');
export const uploadAvatar   = createImageUploader('avatars').single('avatar');

export const uploadService  = createImageUploader('services').fields([
  { name: 'images', maxCount: 5 },
  { name: 'icon',   maxCount: 1 }
]);

// Para comprobantes de pago (cliente — acepta imágenes y PDFs)
export const uploadPaymentProof  = createProofUploader('proofs').single('proof');
export const uploadPaymentProofs = createProofUploader('proofs').array('proofs', 3);

// Para PDF de presupuesto generado desde el front (admin)
export const uploadBudgetPdf = createPdfUploader('budgets').single('pdf');

export default uploadProduct;