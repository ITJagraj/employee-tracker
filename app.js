const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const Connection = require('mysql2/typings/mysql/lib/Connection');
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
        type: 'list', message: "Welcome to the employee database! Please choose the options", name: 'action', choices: [
          'View all employees',
          'View all departments',
          'View all roles',
          'Add an employee',
          'Add a department',
          'Add a role',
          'Update employee role',
          'Delete an employee',
          'EXIT'
        ]
      }
    ])
    .then((answers) => {
      switch (answer.action) {
        case 'View all employees':
          viewEmployees();
          break;
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Update employee role':
          updateRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'EXIT':
          exitApp();
          break;
        default:
          break;
      }
    });



};
// view all employees in the database
function viewEmployees() {
  const query = 'SELECT * FROM employee'
  Connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//view all departments
function viewEmployees() {
  const query = 'SELECT * FROM department'
  Connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//view all roles
function viewEmployees() {
  const query = 'SELECT * FROM role';
  Connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//Add an employee to the database
async function addEmployee() {
  inquirer.prompt([
      {
          name: 'first_name',
          type: 'input',
          message: 'Enter in their first name.'
      },
      {
          name: 'last_name',
          type: 'input',
          message: 'Enter in their last name.'
      },
      {
          name: 'roles',
          type: 'list',
          message: 'What is their role?',
          choices: await selectRoles()
      }
  ]).then(function(res) {
      let rolesId = res.roles
      
      connection.query('INSERT INTO employee SET?', {
          first_name: res.firstname,
          last_name: res.lastname,
          roles_id : rolesId
      }, function (err) {
          if (err) throw err 
          console.table(res)
          options();
      })
  })  
};


