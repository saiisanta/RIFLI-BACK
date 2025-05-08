import Book from "../models/Book.js";

export const getAllBooks = async () => {
  return await Book.findAll();
};

export const getBookById = async (id) => {
  return await Book.findByPk(id);
};

export const createBook = async (data) => {
  return await Book.create(data);
};

export const updateBook = async (id, data) => {
  const book = await Book.findByPk(id);
  if (!book) return null;
  return await book.update(data);
};

export const deleteBook = async (id) => {
  const book = await Book.findByPk(id);
  if (!book) return null;
  await book.destroy();
  return true;
};