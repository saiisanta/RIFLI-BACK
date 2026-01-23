// models/BankAccount.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BankAccount = sequelize.define('BankAccount', {
  bank_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  account_type: {
    type: DataTypes.ENUM('SAVINGS', 'CHECKING'),
    allowNull: false
  },
  account_number: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  cbu: {
    type: DataTypes.STRING(22),
    allowNull: false,
    validate: {
      len: [22, 22]
    }
  },
  alias: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  holder_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  holder_document: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  holder_cuit: {
    type: DataTypes.STRING(11),
    allowNull: false,
    validate: {
      is: /^[0-9]{11}$/ // Valida exactamente 11 números
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'bank_accounts',
  timestamps: true
});

export default BankAccount;