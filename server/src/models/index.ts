import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

// Retrieve environment variables
const { DB_URL, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

// Ensure the necessary environment variables are defined
if (!DB_URL && (!DB_NAME || !DB_USER || !DB_PASSWORD)) {
console.log('DB_URL:', process.env.DB_URL);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

  throw new Error('Missing required database environment variables');
}


const sequelize = DB_URL
  ? new Sequelize(DB_URL)
  : new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, { 
      host: 'localhost',
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    });


const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);


User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });


export { sequelize, User, Ticket };
