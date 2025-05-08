const { Quote } = require('../models');

const getAllQuotes = async () => {
  return await Quote.findAll();
};

const getQuoteById = async (id) => {
  return await Quote.findByPk(id);
};

const createQuote = async (data) => {
  return await Quote.create(data);
};

const updateQuote = async (id, data) => {
  const quote = await Quote.findByPk(id);
  if (!quote) return null;
  return await quote.update(data);
};

const deleteQuote = async (id) => {
  const quote = await Quote.findByPk(id);
  if (!quote) return null;
  await quote.destroy();
  return true;
};

module.exports = {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
