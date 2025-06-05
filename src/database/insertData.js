const { Product, Service } = require('../models');

const insertInitialData = async () => {
  // 1. Insertar servicios primero
  const electricService = await Service.create({
    name: "Instalación Eléctrica Residencial",
    description: "Instalación completa con certificación",
    basePrice: 1200,
    category: "electricidad/instalaciones"
  });

  const cameraService = await Service.create({
    name: "Instalación de Cámaras",
    description: "Incluye configuración remota",
    basePrice: 350,
    category: "seguridad/instalacion"
  });

  // 2. Insertar productos relacionados
  await Product.bulkCreate([
    {
      name: "Cable Eléctrico 2.5mm x 100m",
      description: "Cable de cobre para instalaciones",
      price: 45.99,
      stock: 50,
      category: "electricidad/cables",
      brand: "Pirelli",
      requiresInstallation: false
    },
    {
      name: "Cámara Hikvision 4MP",
      description: "Cámara exterior con visión nocturna",
      price: 89.99,
      stock: 25,
      category: "seguridad/camaras",
      brand: "Hikvision",
      requiresInstallation: true,
      serviceId: cameraService.id // Relación directa
    },
    {
      name: "Placa Durlock 1.20x2.40m",
      description: "Para tabiques y cielorrasos",
      price: 12.80,
      stock: 200,
      category: "construccion/seco",
      brand: "Durlock",
      requiresInstallation: true
    }
  ]);

  console.log("✅ Datos insertados correctamente");
};

// Ejecutar (y luego comentar esta línea después del primer uso)
insertInitialData();