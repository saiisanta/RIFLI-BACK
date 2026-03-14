// controllers/quote.controller.js
import Quote from '../models/Quote.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Address from '../models/Address.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

// Función auxiliar para eliminar archivos
const deleteFile = async (filePath) => {
  if (!filePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    if (fsSync.existsSync(fullPath)) {
      await fs.unlink(fullPath);
      console.log('✓ Archivo eliminado:', fullPath);
    }
  } catch (err) {
    console.error('✗ Error al eliminar archivo:', err);
  }
};

// Generar número de cotización único
const generateQuoteNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Quote.count({ 
    where: { 
      quote_number: { [Op.like]: `QUOTE-${year}-%` } 
    } 
  });
  return `QUOTE-${year}-${String(count + 1).padStart(5, '0')}`;
};

// ========== 1. CREAR COTIZACIÓN (CLIENTE) ==========
export const createQuote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { service_id, address_id, service_details, client_notes } = req.body;
    
    // Validar que el servicio existe
    const service = await Service.findByPk(service_id);
    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    // Validar que la dirección existe y pertenece al usuario
    const address = await Address.findOne({
      where: { 
        id: address_id,
        user_id: req.user.id 
      }
    });
    if (!address) {
      return res.status(404).json({ error: 'Dirección no encontrada o no autorizada' });
    }
    
    // Parsear service_details si viene como string
    let parsedDetails = service_details;
    if (typeof service_details === 'string') {
      try {
        parsedDetails = JSON.parse(service_details);
      } catch (e) {
        return res.status(400).json({ error: 'Formato inválido de service_details' });
      }
    }
    
    // Generar número de cotización
    const quote_number = await generateQuoteNumber();
    
    const newQuote = await Quote.create({
      client_id: req.user.id,
      service_id,
      address_id,
      service_type: service.type,
      service_details: parsedDetails,
      client_notes: client_notes || null,
      quote_number,
      status: 'PENDING'
    });
    
    // Incluir relaciones en la respuesta
    const quoteWithRelations = await Quote.findByPk(newQuote.id, {
      include: [
        { model: Service, as: 'service', attributes: ['id', 'type'] },
        { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Address, as: 'address' }
      ]
    });
    
    res.status(201).json(quoteWithRelations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
};

// ========== 2. OBTENER TODAS LAS COTIZACIONES ==========
export const getAllQuotes = async (req, res) => {
  try {
    const { status, client_id, service_id, from_date, to_date } = req.query;
    
    const where = {};
    
    // Filtros
    if (status) where.status = status;
    if (client_id) where.client_id = client_id;
    if (service_id) where.service_id = service_id;
    
    // Filtro por rango de fechas
    if (from_date || to_date) {
      where.created_at = {};
      if (from_date) where.created_at[Op.gte] = new Date(from_date);
      if (to_date) where.created_at[Op.lte] = new Date(to_date);
    }
    
    // Si es cliente, solo sus cotizaciones
    if (req.user.role === 'CLIENT') {
      where.client_id = req.user.id;
    }
    
    const quotes = await Quote.findAll({
      where,
      include: [
        { model: Service, as: 'service', attributes: ['id', 'type'] },
        { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Address, as: 'address' }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
};

// ========== 3. OBTENER COTIZACIÓN POR ID ==========
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id, {
      include: [
        { model: Service, as: 'service' },
        { model: User, as: 'client', attributes: { exclude: ['password'] } },
        { model: Address, as: 'address' }
      ]
    });
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    // Si es cliente, solo puede ver sus propias cotizaciones
    if (req.user.role === 'CLIENT' && quote.client_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
};

// ========== 4. AGREGAR PRESUPUESTO (ADMIN) ==========
export const addBudget = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const quote = await Quote.findByPk(req.params.id, { transaction });
    
    if (!quote) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (quote.status !== 'PENDING') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Solo se puede presupuestar cotizaciones en estado PENDING' 
      });
    }
    
    const { 
      materials_budget, 
      labor_budget,
      discount_percentage,
      tax_percentage,
      valid_until,
      estimated_completion_days,
      internal_notes
    } = req.body;
    
    // Parsear budgets si vienen como string
    let parsedMaterials = materials_budget;
    let parsedLabor = labor_budget;
    
    if (typeof materials_budget === 'string') {
      parsedMaterials = JSON.parse(materials_budget);
    }
    if (typeof labor_budget === 'string') {
      parsedLabor = JSON.parse(labor_budget);
    }
    
    // Calcular totales
    const materialsTotal = parsedMaterials?.total || 0;
    const laborTotal = parsedLabor?.total || 0;
    const subtotal = materialsTotal + laborTotal;
    
    const discountPct = discount_percentage || 0;
    const discountAmount = subtotal * (discountPct / 100);
    
    const taxPct = tax_percentage || 21;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxPct / 100);
    
    const quotedAmount = taxableAmount + taxAmount;
    
    const depositPct = quote.deposit_percentage || 50;
    const depositAmount = quotedAmount * (depositPct / 100);
    const finalAmount = quotedAmount - depositAmount;
    
    await quote.update({
      materials_budget: parsedMaterials,
      labor_budget: parsedLabor,
      materials_subtotal: materialsTotal,
      labor_subtotal: laborTotal,
      discount_percentage: discountPct,
      discount_amount: discountAmount,
      tax_percentage: taxPct,
      tax_amount: taxAmount,
      quoted_amount: quotedAmount,
      deposit_amount: depositAmount,
      final_payment_amount: finalAmount,
      valid_until: valid_until || null,
      estimated_completion_days: estimated_completion_days || null,
      internal_notes: internal_notes || quote.internal_notes,
      status: 'QUOTED',
      quoted_at: new Date()
    }, { transaction });
    
    await transaction.commit();
    
    const updatedQuote = await Quote.findByPk(quote.id, {
      include: [
        { model: Service, as: 'service' },
        { model: User, as: 'client', attributes: ['id', 'first_name', 'last_name', 'email'] }
      ]
    });
    
    res.json(updatedQuote);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al agregar presupuesto' });
  }
};

// ========== 5. SUBIR COMPROBANTE DE PAGO ==========
export const uploadPaymentProof = async (req, res) => {
  try {
    const { payment_type } = req.body; // 'deposit' o 'final'
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    if (!['deposit', 'final'].includes(payment_type)) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(400).json({ error: 'payment_type debe ser "deposit" o "final"' });
    }
    
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    // Solo el cliente puede subir comprobantes
    if (quote.client_id !== req.user.id) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    const proofUrl = `/uploads/proofs/${req.file.filename}`;
    
    if (payment_type === 'deposit') {
      // Eliminar comprobante anterior si existe
      if (quote.deposit_proof_url) {
        await deleteFile(quote.deposit_proof_url);
      }
      
      await quote.update({
        deposit_proof_url: proofUrl,
        deposit_payment_status: 'PROOF_UPLOADED'
      });
    } else {
      // Eliminar comprobante anterior si existe
      if (quote.final_proof_url) {
        await deleteFile(quote.final_proof_url);
      }
      
      await quote.update({
        final_proof_url: proofUrl,
        final_payment_status: 'PROOF_UPLOADED'
      });
    }
    
    res.json({
      message: 'Comprobante subido correctamente',
      proof_url: proofUrl
    });
  } catch (err) {
    // Limpiar archivo si hubo error
    if (req.file) {
      await deleteFile(`/uploads/proofs/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: 'Error al subir comprobante' });
  }
};

// ========== 6. APROBAR/RECHAZAR COMPROBANTE (ADMIN) ==========
export const reviewPaymentProof = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { payment_type, action, rejection_reason } = req.body;
    
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    if (payment_type === 'deposit') {
      if (action === 'approve') {
        await quote.update({
          deposit_payment_status: 'PAID',
          deposit_paid_at: new Date()
        });
      } else {
        await quote.update({
          deposit_payment_status: 'REJECTED',
          internal_notes: `${quote.internal_notes || ''}\n[Seña rechazada]: ${rejection_reason}`
        });
      }
    } else {
      if (action === 'approve') {
        await quote.update({
          final_payment_status: 'PAID',
          final_payment_paid_at: new Date()
        });
      } else {
        await quote.update({
          final_payment_status: 'REJECTED',
          internal_notes: `${quote.internal_notes || ''}\n[Pago final rechazado]: ${rejection_reason}`
        });
      }
    }
    
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al revisar comprobante' });
  }
};

// ========== 7. ACTUALIZAR ESTADO ==========
export const updateQuoteStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { status, rejection_reason } = req.body;
    
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    const updates = { status };
    
    // Actualizar fechas según el estado
    if (status === 'ACCEPTED') {
      updates.accepted_at = new Date();
    } else if (status === 'REJECTED') {
      updates.rejected_at = new Date();
      updates.rejection_reason = rejection_reason;
    } else if (status === 'IN_PROGRESS') {
      updates.started_at = new Date();
    } else if (status === 'COMPLETED') {
      updates.completed_at = new Date();
    }
    
    await quote.update(updates);
    
    res.json(quote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// ========== 8. SOFT DELETE ==========
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByPk(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    
    // Guardar referencias a archivos antes de eliminar
    const filesToDelete = [];
    if (quote.deposit_proof_url) filesToDelete.push(quote.deposit_proof_url);
    if (quote.final_proof_url) filesToDelete.push(quote.final_proof_url);
    
    await quote.destroy(); // Soft delete
    
    // Eliminar archivos
    for (const file of filesToDelete) {
      await deleteFile(file);
    }
    
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar cotización' });
  }
};