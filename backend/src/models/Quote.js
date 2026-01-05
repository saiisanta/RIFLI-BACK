import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Quote = sequelize.define('Quote', {
  details: { 
    type: DataTypes.TEXT,
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  }
}, {
  // Local Table
  // tableName: 'quotes',
  tableName: 'Quotes',
  timestamps: true
});

export default Quote;