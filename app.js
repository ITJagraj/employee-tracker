const inquirer = require('inquirer');
const mysql = require('mysql2');
// Connect connection
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
//connect to the sql server to sql db
db.connect((err) => {
    if (err) throw err;
    console.log("connected to employees_db");
})
//Prompt user with list of options to choose from
function options() {
  inquirer
  .prompt([
    {
      type: 'list', message: "Welcome to the employee database! Please choose the options" , name: 'framwork', choices: [
        'reat',
        'node'
      ] 
    }
  ])
  .then((answers) => {
    console.log(answer);
  });


  
}

  