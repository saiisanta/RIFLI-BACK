import express from 'express';

import { getAllBrands, createBrand } from '../controllers/brand.controller.js';
// import { validateBrand } from '../validations/brand.validations.js';
// import validateFields from '../middlewares/validateFields.middleware.js';

const router = express.Router();
router.get('/', getAllBrands);
router.post('/', createBrand);
// router.post('/brands', validateBrand, validateFields, createBrand);

export default router;