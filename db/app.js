const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      port: 3306,
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Bootcamp@123',
      database: 'employees_db'
    },
    console.log('Connected to the employees_db database.')
  );
