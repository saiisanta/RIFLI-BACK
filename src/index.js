import express from "express";
import morgan from "morgan";
import sequelize from "./config/db.js";
import bookRoutes from "./routes/books.routes.js";
import cors from 'cors';  // Agregar al inicio del archivo
import Book from "./models/Book.js"; // Para sincronizar

const app = express();
const PORT = 3000;

app.use(morgan("dev"));
app.use(cors());  // Esto habilita CORS para todas las rutas
app.use(express.json());
app.use("/api", bookRoutes);

app.get("/", (req, res) => {
  res.send("API de libros funcionando 📚");
});

try {
  await sequelize.sync();
  console.log("📁 Base de datos sincronizada");
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error al iniciar la app:", error);
}