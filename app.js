const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
// Connect connection
const connection = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Itprofessional@31',
    database: 'employees_db'
  },
  console.log('Connected to the employees_db database.')
);
//connect to the sql server to sql db
connection.connect((err) => {
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
      switch (answers.action) {
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

options();
// view all employees in the database
function viewEmployees() {
  const query = 'SELECT * FROM employee'
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//view all departments
function viewDepartments() {
  const query = 'SELECT * FROM department'
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//view all roles
function viewRoles() {
  const query = 'SELECT * FROM role';
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
  })
};

//Add an employee to the database
function addEmployee() {
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

    }
  ]).then(function (res) {
    let rolesId = res.roles

    connection.query('INSERT INTO employee SET?', {
      first_name: res.firstname,
      last_name: res.lastname,
      roles_id: rolesId
    }, function (err) {
      if (err) throw err
      console.table(res)
      options();
    })
  })
};
//add a department
function addDepartment() {

  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department.'
    }
  ]).then(function (res) {
    //let name = res
    connection.promise().query('INSERT INTO department SET ?', {
      name: res.name
    }).then(() => console.log(`added department ${res.name}`))
      .then(() => options())

  })
}
//Add roles
function addRole() {
  connection.promise().query('SELECT * FROM department') //promise to make sure that mysql coonection is up and running
  .then(([rows])=> {
    let departments = rows;
    const departmentList = departments.map(({id, name}) => ({
      name: name,
      value: id
    }))

    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the name of the roles .'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary of the role .'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Which department does the role belong to .',
        choices: departmentList 
      }
    ]).then(function (res) {
      //let name = res
      connection.promise().query('INSERT INTO role SET ?', {
        title: res.title,
        salary: res.salary,
        department_id: res.department_id
      }).then(() => console.log(`added role ${res.title}`))
        .then(() => options())
  
    })
  }) 

}

//Update an employee
function updateEmployee() {
  connection.promise().query('SELECT * FROM department')
  .then(([rows])=> {
    let employee = rows;
    const departmentList = departments.map(({id, name}) => ({
      name: name,
      value: id
    }))

    inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the name of the roles .'
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary of the role .'
      },
      {
        name: 'department_id',
        type: 'list',
        message: 'Which department does the role belong to .',
        choices: departmentList 
      }
    ]).then(function (res) {
      //let name = res
      connection.promise().query('INSERT INTO role SET ?', {
        title: res.title,
        salary: res.salary,
        department_id: res.department_id
      }).then(() => console.log(`added role ${res.title}`))
        .then(() => options())
  
    })
  }) 

}


