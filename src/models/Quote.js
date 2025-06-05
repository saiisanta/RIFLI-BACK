const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quote = sequelize.define('Quote', {
  details: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'approved', 'rejected']]
    }
  }
});

module.exports = Quote;