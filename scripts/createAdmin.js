require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function createAdmin() {
  try {
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    const hash = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO admins (username, password)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE password = VALUES(password)`,
      [username, hash]
    );

    console.log(`Admin "${username}" created/updated successfully.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
