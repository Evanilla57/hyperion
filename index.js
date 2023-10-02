// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MaySQL!2345',
    database: 'company_db'
});

// sample query
db.query(
    'SELECT * FROM `department` WHERE `id` = 1',
    function (err, results, fields) {
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    }
);

// Array of questions for user input
inquirer
    .prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update An Employee Role'
            ],
        },
        //Add A Department
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        },
        //Add A Role
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'What is the department of the role?',
        },
        //Add An Employee
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'employeeRole',
            message: 'What is the role of the employee?',
        },
        {
            type: 'input',
            name: 'employeeManager',
            message: 'Who is the manager of the employee?',
        },
        //TODO: Figure out emplpoyee options
        //Update An Employee Role
        {
            type: 'list',
            name: 'employeeOptions',
            message: 'What is the name of the employee whose role needs to be updated?',
            choices: ['']
        },
        {
            type: 'input',
            name: 'employeeRoleNew',
            message: "What is the name of the employee's new role?"
        },
    ])
// .then((data) => {
//     console.log(data);
//     fs.writeFile('newREADME.md', generateMarkdown(data), (err) =>
//         err ? console.log(err) : console.log('Success!')
//     );
// });