import { User } from '../models/user.js';

export const seedUsers = async () => {
  await User.bulkCreate([
    { username: 'Destinee', password: 'Miles' },
    { username: 'Mya', password: 'Jones' },
    { username: 'carl', password: 'Woods' },
  ], { individualHooks: true });
};
