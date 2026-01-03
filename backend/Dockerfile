# Usa una imagen de Node
FROM node:20

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las librerías
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que usa tu app (ejemplo 3000)
EXPOSE 3000

# Comando para arrancar
CMD ["npm", "start"]