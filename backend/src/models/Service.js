import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('Service', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT
  }
}, {
  // Local Table
  // tableName: 'services',
  tableName: 'Services',
  timestamps: true
});

export default Service;