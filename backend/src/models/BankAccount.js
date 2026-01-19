import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BankAccount = sequelize.define('BankAccount', {
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  accountType: {
    type: DataTypes.ENUM('SAVINGS', 'CHECKING'),
    allowNull: false
  },
  accountNumber: {
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
  holderName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  holderDocument: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  holderCuit: {
    type: DataTypes.STRING(11),
    allowNull: false,
    validate: {
      is: /^[0-9]{11}$/ // Valida exactamente 11 números
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Bank_accounts',
  timestamps: true
});

export default BankAccount;