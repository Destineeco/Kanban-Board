import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';
// Retrieve environment variables
const { DB_URL, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
// Ensure the necessary environment variables are defined
if (!DB_URL && (!DB_NAME || !DB_USER || !DB_PASSWORD)) {
    throw new Error('Missing required database environment variables');
}
// If DB_URL is available, use that for the connection, otherwise, use individual variables
const sequelize = DB_URL
    ? new Sequelize(DB_URL)
    : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            decimalNumbers: true,
        },
    });
// Define Models
const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);
// Define Relationships
User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });
// Export Sequelize and Models
export { sequelize, User, Ticket };
