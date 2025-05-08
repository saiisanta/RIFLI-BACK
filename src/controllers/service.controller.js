const { Service } = require('../models');

const getAllServices = async () => {
  return await Service.findAll();
};

const getServiceById = async (id) => {
  return await Service.findByPk(id);
};

const createService = async (data) => {
  return await Service.create(data);
};

const updateService = async (id, data) => {
  const service = await Service.findByPk(id);
  if (!service) return null;
  return await service.update(data);
};

const deleteService = async (id) => {
  const service = await Service.findByPk(id);
  if (!service) return null;
  await service.destroy();
  return true;
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
