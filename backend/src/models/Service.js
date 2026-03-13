// models/Service.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  short_description: {
    type: DataTypes.STRING(500)
  },

  long_description: {
    type: DataTypes.STRING(5000)
  },

  icon: {
    type: DataTypes.STRING(500),
    comment: 'Ruta del archivo SVG/PNG del icono'
  },
  images: {
    type: DataTypes.JSON,  
    allowNull: true,
    comment: 'Array de rutas de imágenes del servicio'
  },

  features: {
    type: DataTypes.JSON,
    comment: 'Array de strings: ["Feature 1", "Feature 2"]'
  },

  form_schema: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Esquema del formulario dinámico para cotizaciones'
  },

  /* Ejemplo de estructura:
  {
    "fields": [
      {
        "id": "tipo_instalacion",
        "type": "select",
        "comment": "Comentario de ayuda para aclarar lo que el usuario debe escribir en el campo (No obligatorio)"
        "label": "Tipo de instalación",
        "required": true,
        "options": ["Residencial", "Comercial", "Industrial"],
        "placeholder": "Seleccione el tipo",
        "validation": {
          "required": true
        }
      },
      {
        "id": "superficie_m2",
        "type": "number",
        "label": "Superficie (m²)",
        "comment": "Comentario de ayuda para aclarar lo que el usuario debe escribir en el campo (No obligatorio)"
        "required": true,
        "min": 1,
        "max": 10000,
        "placeholder": "Ingrese la superficie"
      },
      {
        "id": "fases",
        "type": "radio",
        "label": "Cantidad de fases",
        "comment": "Comentario de ayuda para aclarar lo que el usuario debe escribir en el campo (No obligatorio)"
        "required": true,
        "options": ["Monofásica", "Bifásica", "Trifásica"]
      },
      {
        "id": "requiere_certificado",
        "type": "checkbox",
        "label": "Requiere certificado TE1"
      },
      {
        "id": "voltaje",
        "type": "select",
        "label": "Voltaje requerido",
        "comment": "Comentario de ayuda para aclarar lo que el usuario debe escribir en el campo (No obligatorio)"
        "required": true,
        "options": ["220V", "380V"]
      },
      {
        "id": "observaciones",
        "type": "textarea",
        "label": "Observaciones adicionales",
        "comment": "Comentario de ayuda para aclarar lo que el usuario debe escribir en el campo (No obligatorio)"
        "placeholder": "Detalles adicionales del proyecto",
        "maxLength": 500
      }
    ]
  } 
  */

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'services',
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['is_active'] },
  ]
});

export default Service;