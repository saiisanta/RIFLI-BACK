// controllers/bankAccount.controller.js
import BankAccount from '../models/BankAccount.js';
import { validationResult } from 'express-validator';

// ========== GET (público) — siempre es una sola ==========
export const getBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      // cliente solo ve si está activa, admin ve siempre
      where: req.user.role !== 'ADMIN' ? { is_active: true } : {}
    });

    if (!account) {
      return res.status(404).json({ error: 'No hay cuenta bancaria configurada' });
    }

    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cuenta bancaria' });
  }
};

// ========== CREAR (admin) — solo si no existe ninguna ==========
export const createBankAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // ✅ Verificar que no exista ninguna
    const existing = await BankAccount.findOne();
    if (existing) {
      return res.status(400).json({
        error: 'Ya existe una cuenta bancaria. Solo podés modificarla.'
      });
    }

    const {
      bank_name, account_type, account_number,
      cbu, alias, holder_name, holder_document, holder_cuit
    } = req.body;

    const account = await BankAccount.create({
      bank_name, account_type, account_number,
      cbu, alias: alias || null,
      holder_name, holder_document, holder_cuit,
      is_active: true
    });

    res.status(201).json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cuenta bancaria' });
  }
};

// ========== ACTUALIZAR (admin) — busca la única existente ==========
export const updateBankAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const account = await BankAccount.findOne();
    if (!account) {
      return res.status(404).json({ error: 'No hay cuenta bancaria configurada' });
    }

    const {
      bank_name, account_type, account_number,
      cbu, alias, holder_name, holder_document, holder_cuit
    } = req.body;

    // Verificar CBU único si cambió
    if (cbu && cbu !== account.cbu) {
      const duplicate = await BankAccount.findOne({ where: { cbu } });
      if (duplicate) {
        return res.status(400).json({ error: 'Ya existe una cuenta con ese CBU' });
      }
    }

    await account.update({
      bank_name:       bank_name       ?? account.bank_name,
      account_type:    account_type    ?? account.account_type,
      account_number:  account_number  ?? account.account_number,
      cbu:             cbu             ?? account.cbu,
      alias:           alias           !== undefined ? alias : account.alias,
      holder_name:     holder_name     ?? account.holder_name,
      holder_document: holder_document ?? account.holder_document,
      holder_cuit:     holder_cuit     ?? account.holder_cuit,
    });

    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar cuenta bancaria' });
  }
};

// ========== TOGGLE ACTIVO/INACTIVO (admin) ==========
export const toggleBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne();
    if (!account) return res.status(404).json({ error: 'No hay cuenta bancaria configurada' });

    await account.update({ is_active: !account.is_active });

    res.json({
      message: `Cuenta ${account.is_active ? 'activada' : 'desactivada'} correctamente`,
      account
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};