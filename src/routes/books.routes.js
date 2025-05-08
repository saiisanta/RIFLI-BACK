import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from "../services/book.services.js";

const router = express.Router();

router.get("/books", async (req, res) => {
  const books = await getAllBooks();
  res.json(books);
});

router.get("/books/:id", async (req, res) => {
  const book = await getBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Libro no encontrado" });
  res.json(book);
});

router.post("/books", async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Título y autor son obligatorios" });
  }
  const newBook = await createBook(req.body);
  res.status(201).json(newBook);
});

router.put("/books/:id", async (req, res) => {
  const updated = await updateBook(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Libro no encontrado" });
  res.json(updated);
});

router.delete("/books/:id", async (req, res) => {
  const deleted = await deleteBook(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Libro no encontrado" });
  res.json({ message: "Libro eliminado correctamente" });
});

export default router;