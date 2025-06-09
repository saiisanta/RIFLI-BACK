// Archivo: backend-tpi/src/seed/seedProducts.js

// Ruta correcta al modelo Product:
const Product = require("../models/Product");

// Ruta correcta a la configuración de Sequelize:
// const sequelize = require("../config/db");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos OK.");

    // Si querés reiniciar la tabla antes de poblarla:
     await Product.sync({ force: true });

    const productosMock = [
      {
        name: "UTP Cat5e 305m",
        description: "Bobina de cable de red UTP Cat5e, 305 metros, ideal para LAN 1 Gbps.",
        imageUrl: "/api/images/Cables.png",
        price: 85.99,
        categoria: "Cables",
        marca: "Generic",
        stock: 120
      },
      {
        name: "Coaxial RG59 100m",
        description: "Bobina de 100 metros de cable coaxial RG59 para cámaras y TV analógica.",
        imageUrl: "/api/images/Cables.png",
        price: 45.50,
        categoria: "Cables",
        marca: "Generic",
        stock: 75
      },
      {
        name: "HDMI 2.0 – 3m",
        description: "Cable HDMI 2.0 alta velocidad, 4K@60Hz, 3 metros, compatible con todos los dispositivos.",
        imageUrl: "/api/images/Cables.png",
        price: 12.30,
        categoria: "Cables",
        marca: "Belkin",
        stock: 200
      },

      // Cámaras
      {
        name: "IPC-HFW1230S",
        description: "Cámara bullet 2MP Dahua, lente 3.6 mm, visión nocturna EXIR 30 m, IP67.",
        imageUrl: "/api/images/Camaras.png",
        price: 59.99,
        categoria: "Cámaras",
        marca: "Dahua",
        stock: 45
      },
      {
        name: "HAC-HFW1200R",
        description: "Cámara HDCVI 2MP Dahua, lente 2.8 mm, IR 20 m, resistente al agua (IP67).",
        imageUrl: "/api/images/Camaras.png",
        price: 49.75,
        categoria: "Cámaras",
        marca: "Dahua",
        stock: 60
      },
      {
        name: "GN-2MP-Bullet",
        description: "Cámara bullet 2MP Garnet, lente 3.6 mm, IR 25 m, carcasa metálica IP66.",
        imageUrl: "/api/images/Camaras.png",
        price: 52.00,
        categoria: "Cámaras",
        marca: "Garnet",
        stock: 30
      },
      {
        name: "GN-4MP-Domo",
        description: "Cámara domo 4MP Garnet, lente varifocal 2.8–12 mm, IP66, micrófono integrado.",
        imageUrl: "/api/images/Camaras.png",
        price: 88.40,
        categoria: "Cámaras",
        marca: "Garnet",
        stock: 25
      },
      {
        name: "ProCam 1.3MP",
        description: "Cámara seguridad DSC 1.3MP, lente 2.8 mm, IR 15 m, carcasa plástica resistente.",
        imageUrl: "/api/images/Camaras.png",
        price: 35.20,
        categoria: "Cámaras",
        marca: "DSC",
        stock: 50
      },
      {
        name: "NBN-73023BA",
        description: "Cámara IP 1080p Bosch, lente 2.8 mm, WDR 120 dB, audio bidireccional, IP67.",
        imageUrl: "/api/images/Camaras.png",
        price: 299.00,
        categoria: "Cámaras",
        marca: "Bosch",
        stock: 10
      },
      {
        name: "NDP-7512-Z30",
        description: "Cámara PTZ 2MP Bosch, zoom 30x, WDR, visión nocturna, IK10 antivandálica.",
        imageUrl: "/api/images/Camaras.png",
        price: 1200.50,
        categoria: "Cámaras",
        marca: "Bosch",
        stock: 5
      },
      {
        name: "DS-2CD2043G0-I",
        description: "Cámara IP 4MP Hikvision, lente 2.8 mm, IR 30 m, slot microSD.",
        imageUrl: "/api/images/Camaras.png",
        price: 79.99,
        categoria: "Cámaras",
        marca: "Hikvision",
        stock: 40
      },
      {
        name: "DS-2CE16D8T-IT3F",
        description: "Cámara Turbo HD 2MP Hikvision, lente 2.8 mm, IR EXIR 40 m, IP66.",
        imageUrl: "/api/images/Camaras.png",
        price: 29.50,
        categoria: "Cámaras",
        marca: "Hikvision",
        stock: 70
      },
      {
        name: "IPC-F22FP",
        description: "Cámara domo 1080p Imou, lente 2.8 mm, audio bidireccional, IR 30 m.",
        imageUrl: "/api/images/Camaras.png",
        price: 45.00,
        categoria: "Cámaras",
        marca: "Imou",
        stock: 55
      },
      {
        name: "Tapo C200",
        description: "Cámara IP 1080p Tapo, giro 360°, audio bidireccional, detección de movimiento.",
        imageUrl: "/api/images/Camaras.png",
        price: 39.99,
        categoria: "Cámaras",
        marca: "TP-Link",
        stock: 80
      },

      // DVRs
      {
        name: "XVR5104HS",
        description: "DVR 4 canales Dahua HDCVI/Analog/IP, HDMI, grabación 1080p en todos los canales.",
        imageUrl: "/api/images/DVR.png",
        price: 89.99,
        categoria: "DVR",
        marca: "Dahua",
        stock: 20
      },
      {
        name: "DS-7204HQHI-K1",
        description: "DVR 4 canales Turbo HD Hikvision, compresión H.265+, HDMI y VGA, plug&play.",
        imageUrl: "/api/images/DVR.png",
        price: 95.50,
        categoria: "DVR",
        marca: "Hikvision",
        stock: 18
      },
      {
        name: "GN-DVR-16",
        description: "DVR 16 canales 1080p Garnet, salida HDMI, soporte P2P, grabación remota.",
        imageUrl: "/api/images/DVR.png",
        price: 120.75,
        categoria: "DVR",
        marca: "Garnet",
        stock: 12
      },

      // Herramientas
      {
        name: "Taladro Inalámbrico 18V",
        description: "Taladro a batería 18V con dos velocidades, batería 1.5Ah, incluye brocas básicas.",
        imageUrl: "/api/images/Herramientas.png",
        price: 55.00,
        categoria: "Herramientas",
        marca: "Black+Decker",
        stock: 35
      },
      {
        name: "Multímetro Digital MX-328",
        description: "Multímetro digital MX-328 autorango: mide voltaje, corriente, resistencia, diodos.",
        imageUrl: "/api/images/Herramientas.png",
        price: 12.99,
        categoria: "Herramientas",
        marca: "Fluke",
        stock: 60
      },
      {
        name: "Destornillador de Precisión (Set 6 pz)",
        description: "Juego de destornilladores de precisión para electrónica y reparaciones pequeñas.",
        imageUrl: "/api/images/Herramientas.png",
        price: 9.50,
        categoria: "Herramientas",
        marca: "Stanley",
        stock: 100
      },

      // Durlock / Placas de yeso
      {
        name: "Placa Yeso Durlock 1.20×2.40m",
        description: "Placa de yeso laminado Durlock, grosor 12 mm, para cielorrasos y tabiquería.",
        imageUrl: "/api/images/Durlock.png",
        price: 8.75,
        categoria: "Durlock",
        marca: "Durlock",
        stock: 200
      },
      {
        name: "Placa Acústica Durlock 1.20×2.40m",
        description: "Placa acústica Durlock 12 mm, tratamiento de sonido, ideal para estudios.",
        imageUrl: "/api/images/Durlock.png",
        price: 12.00,
        categoria: "Durlock",
        marca: "Durlock",
        stock: 80
      }
    ];

    await Product.bulkCreate(productosMock);
    console.log("Productos mockup insertados con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("Error al insertar productos mockup:", error);
    process.exit(1);
  }
}

seed();
