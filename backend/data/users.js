import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '10101010',
    isAdmin: true,
  },
  {
    name: 'Fahmid Hasan',
    email: 'fahmid@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '21101234',
  },
  {
    name: 'Nabil Rahman',
    email: 'nabil@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '20101111',
  },
  {
    name: 'Raisa Islam',
    email: 'raisa@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '22305678',
  },
  {
    name: 'Shafiq Ahmed',
    email: 'shafiq@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '19100034',
  },
  {
    name: 'Anika Chowdhury',
    email: 'anika@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '23101256',
  },
  {
    name: 'Mahir Hossain',
    email: 'mahir@email.com',
    password: bcrypt.hashSync('123456', 10),
    studentId: '18101452',
  },
];

export default users;
