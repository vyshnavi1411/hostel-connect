const mongoose = require('mongoose');
const MessMenu = require('./models/MessMenu');
require('dotenv').config();

async function checkMenus() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelconnect');
    const menus = await MessMenu.find({});
    console.log('--- Mess Menus in DB ---');
    console.log(JSON.stringify(menus, null, 2));
    console.log('Total menus:', menus.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkMenus();
