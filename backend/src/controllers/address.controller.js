// controllers/address.controller.js
import Address from '../models/Address.js';
import { validationResult } from 'express-validator';
import sequelize from '../config/db.js';

// ========== 1. OBTENER TODAS LAS DIRECCIONES DEL USUARIO ==========
export const getAllAddresses = async (req, res) => {
  try {
    const { include_inactive } = req.query;
    
    const where = {
      user_id: req.user.id
    };
    
    // Filtrar por estado
    if (include_inactive !== 'true') {
      where.is_active = true;
    }
    
    const addresses = await Address.findAll({
      where,
      order: [
        ['is_default', 'DESC'],  // Dirección por defecto primero
        ['created_at', 'DESC']
      ]
    });
    
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener direcciones' });
  }
};

// ========== 2. OBTENER DIRECCIÓN POR ID ==========
export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id  // Solo puede ver sus propias direcciones
      }
    });
    
    if (!address) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la dirección' });
  }
};

// ========== 3. CREAR DIRECCIÓN ==========
export const createAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const {
      alias,
      street,
      number,
      floor,
      apartment,
      city,
      province,
      postal_code,
      country,
      latitude,
      longitude,
      place_id,
      formatted_address,
      additional_info,
      is_default
    } = req.body;
    
    // Si es la primera dirección del usuario, marcarla como default
    const userAddressCount = await Address.count({
      where: { user_id: req.user.id }
    });
    
    const shouldBeDefault = userAddressCount === 0 || is_default === true;
    
    // Si se marca como default, quitar default de las demás
    if (shouldBeDefault) {
      await Address.update(
        { is_default: false },
        {
          where: { user_id: req.user.id },
          transaction
        }
      );
    }
    
    const newAddress = await Address.create({
      user_id: req.user.id,
      alias,
      street,
      number,
      floor: floor || null,
      apartment: apartment || null,
      city,
      province,
      postal_code,
      country: country || 'Argentina',
      latitude: latitude || null,
      longitude: longitude || null,
      place_id: place_id || null,
      formatted_address: formatted_address || null,
      additional_info: additional_info || null,
      is_default: shouldBeDefault,
      is_active: true
    }, { transaction });
    
    await transaction.commit();
    
    res.status(201).json(newAddress);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear la dirección' });
  }
};

// ========== 4. ACTUALIZAR DIRECCIÓN ==========
export const updateAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    const {
      alias,
      street,
      number,
      floor,
      apartment,
      city,
      province,
      postal_code,
      country,
      latitude,
      longitude,
      place_id,
      formatted_address,
      additional_info,
      is_default,
      is_active
    } = req.body;
    
    // Si se marca como default, quitar default de las demás
    if (is_default === true && !address.is_default) {
      await Address.update(
        { is_default: false },
        {
          where: {
            user_id: req.user.id,
            id: { [sequelize.Sequelize.Op.ne]: address.id }
          },
          transaction
        }
      );
    }
    
    await address.update({
      alias: alias !== undefined ? alias : address.alias,
      street: street !== undefined ? street : address.street,
      number: number !== undefined ? number : address.number,
      floor: floor !== undefined ? floor : address.floor,
      apartment: apartment !== undefined ? apartment : address.apartment,
      city: city !== undefined ? city : address.city,
      province: province !== undefined ? province : address.province,
      postal_code: postal_code !== undefined ? postal_code : address.postal_code,
      country: country !== undefined ? country : address.country,
      latitude: latitude !== undefined ? latitude : address.latitude,
      longitude: longitude !== undefined ? longitude : address.longitude,
      place_id: place_id !== undefined ? place_id : address.place_id,
      formatted_address: formatted_address !== undefined ? formatted_address : address.formatted_address,
      additional_info: additional_info !== undefined ? additional_info : address.additional_info,
      is_default: is_default !== undefined ? is_default : address.is_default,
      is_active: is_active !== undefined ? is_active : address.is_active
    }, { transaction });
    
    await transaction.commit();
    
    res.json(address);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la dirección' });
  }
};

// ========== 5. ESTABLECER DIRECCIÓN POR DEFECTO ==========
export const setDefaultAddress = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    // Quitar default de todas las direcciones del usuario
    await Address.update(
      { is_default: false },
      {
        where: { user_id: req.user.id },
        transaction
      }
    );
    
    // Marcar esta como default
    await address.update({ is_default: true }, { transaction });
    
    await transaction.commit();
    
    res.json({
      message: 'Dirección establecida como predeterminada',
      address
    });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al establecer dirección predeterminada' });
  }
};

// ========== 6. SOFT DELETE ==========
export const deleteAddress = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      transaction
    });
    
    if (!address) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    // Si era la dirección por defecto, asignar default a otra
    if (address.is_default) {
      const otherAddress = await Address.findOne({
        where: {
          user_id: req.user.id,
          id: { [sequelize.Sequelize.Op.ne]: address.id },
          is_active: true
        },
        transaction
      });
      
      if (otherAddress) {
        await otherAddress.update({ is_default: true }, { transaction });
      }
    }
    
    await address.destroy({ transaction });  // Soft delete
    
    await transaction.commit();
    
    res.json({ message: 'Dirección eliminada correctamente' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la dirección' });
  }
};

// ========== 7. OBTENER DIRECCIÓN POR DEFECTO ==========
export const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        user_id: req.user.id,
        is_default: true,
        is_active: true
      }
    });
    
    if (!address) {
      return res.status(404).json({ error: 'No hay dirección predeterminada' });
    }
    
    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener dirección predeterminada' });
  }
};