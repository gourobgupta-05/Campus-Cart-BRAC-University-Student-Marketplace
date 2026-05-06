import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Message from './models/messageModel.js';
import Report from './models/reportModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Message.deleteMany();
    await Report.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;
    // Extract non-admin student users for peer-to-peer product distribution
    const studentSellers = createdUsers.slice(1); 

    const sampleProducts = products.map((product, index) => {
      // Loop over available students sequentially
      return { ...product, seller: studentSellers[index % studentSellers.length]._id };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    // Seed Realistic Messages
    const sampleMessages = [
      { sender: studentSellers[0]._id, receiver: studentSellers[1]._id, content: "Hey, is the physics book currently available?", isRead: true },
      { sender: studentSellers[1]._id, receiver: studentSellers[0]._id, content: "Yes it is! I'm on campus till 4 PM today.", isRead: true },
      { sender: studentSellers[0]._id, receiver: studentSellers[1]._id, content: "Awesome, I'll meet you near the cafeteria at 3:30.", isRead: false },
      { sender: studentSellers[2]._id, receiver: studentSellers[3]._id, content: "Would you take 600 tk for the algorithm book?", isRead: false },
      { sender: studentSellers[4]._id, receiver: adminUser, content: "Hello admin, I accidentally posted duplicate items. Can you delete one?", isRead: false },
    ];
    await Message.insertMany(sampleMessages);

    // Seed Realistic Reports
    const sampleReports = [
      { reporter: studentSellers[0]._id, reportedProduct: createdProducts[1]._id, reason: "Inappropriate language in listing description", status: "pending" },
      { reporter: studentSellers[1]._id, reportedUser: studentSellers[3]._id, reason: "Refused to hand over the item after we met. Scam profile.", status: "pending" },
    ];
    await Report.insertMany(sampleReports);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Message.deleteMany();
    await Report.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
