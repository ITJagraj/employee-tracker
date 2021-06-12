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
        default:
          exit();
      }
    });




};

options();
// view all employees in the database
function viewEmployees() {
  const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN  role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ';
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
  const query = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id';
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    options();
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
    .then(([rows]) => {
      let departments = rows;
      const departmentList = departments.map(({ id, name }) => ({
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
          message: 'Enter the salary of the role .',
          choices: departmentList
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Which department does the role belong to .',
          choices: departmentList
        }
      ]).then(function (res) {
        //let name = res
        console.log(res)
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
function updateRole() {
  connection.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN  role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id')
    .then(([rows]) => {
      let employees = rows;
      const employeeList = employees.map(({id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }))

      inquirer.prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Which employees do you want to update.',
          choices: employeeList
        }
      ]).then(function (res) {
        let employeeId = res.employeeId
        connection.promise().query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id')
          .then(([rows]) =>  {
           let roles = rows;
           const roleChoice = roles.map(({id, title}) => ({
             name: title,
             value: id
           }));
           prompt
          })
      })

    })
}
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

  ]).then(function (res) {
    let first_name = res.first_name
    let last_name = res.last_name
    connection.promise().query('SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id ') //promise to make sure that mysql coonection is up and running
      .then(([rows]) => {
        let roles = rows;
        const roleList = roles.map(({ id, title }) => ({
          name: title,
          value: id
        }))

        inquirer.prompt(
          {
            name: 'roleId',
            type: 'list',
            message: 'Select the roles.',
            choices: roleList
          }).then(function (res) {
            let roleId = res.roleId
            connection.promise().query('SELECT * FROM employee')
              .then(([rows]) => {
                let employees = rows
                const managersList = employees.map(({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id
                }))
                managersList.unshift({ name: "none", value: null })
                inquirer.prompt(
                  {
                    name: 'managerId',
                    type: 'list',
                    message: "Select the employee's manager.",
                    choices: managersList
                  }).then(function (res) {
                    let employee = {
                      manager_id: res.managerId,
                      role_id: roleId,
                      first_name,
                      last_name
                    }
                    connection.promise().query('INSERT INTO employee SET?', employee)
                  }).then(function () {
                    console.log(`added ${first_name} ${last_name}`)
                  })
                  .then(() => options())
              })
          })
      })
  })
}

//EXIT function 
function exit() {
  console.log("exiting the application");
  process.exit()
}
