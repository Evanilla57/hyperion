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

db.connect((err) => {
    if (err) throw err;
    init();
});

// sample query
db.query(
    'SELECT * FROM `department` WHERE `id` = 1',
    function (err, results, fields) {
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    }
);

// TODO: Flesh out each function
// Initialize app with main menu prompts
function init() {
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
                    'Update An Employee Role',
                    'Quit'
                ],
            }])
        .then((data) => {
            const { selection } = data;
            switch (selection) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add A Department':
                    addDepartment();
                    break;
                case 'Add A Role':
                    addRole();
                    break;
                case 'Add An Employee':
                    addEmployee();
                    break;
                case 'Update An Employee Role':
                    updateEmployee();
                    break;
                case 'Quit':
                    db.end();
                    break;
            }
        })
};

// Allows viewing of each table
function viewDepartments() {
    const sql = 'SELECT * FROM department';
  viewQuery(sql);
};

function viewRoles() {
    const sql = 'SELECT * FROM role';
  viewQuery(sql);
};

function viewEmployees() {
    const sql = 'SELECT * FROM employee';
  viewQuery(sql);
};

function addEmployee() {
    let roles = [];
    let managers = [];

    async function getManagersAndRoles() {
        try {
                // Query for managers.
            const managersQuery = await new Promise((resolve, reject) => {
                db.query(`SELECT id, CONCAT(first_name , " ", last_name) AS name 
                FROM employee 
                WHERE role_id IN (12, 2, 3, 14, 8, 7) 
                ORDER BY id`, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            managers = managersQuery.map(({ id, name }) => ({
                name,
                value: id,
            }));

             // Query for roles.
            const rolesQuery = await new Promise((resolve, reject) => {
                db.query("SELECT id, title FROM roles", (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            roles = rolesQuery.map(({ id, title }) => ({
                name: title,
                value: id,
            }));

            // Prompt for user input once both queries are complete.
            promptUserInput();
        } catch (err) {
            console.error(err);
        }
    }
    
    // Function to prompt user input.
    function promptUserInput() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: `What is your employee's first name.`,
                },
                {
                    type: 'input',
                    name: 'last',
                    message: `What is your employee's last name.`,
                },
                {
                    type: 'list',
                    name: 'role',
                    message: `What is your employee's role.`,
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: `Who is your employee's manager.`,
                    choices: [
                        { name: 'None', value: null },
                        ...managers,
                    ],
                },
            ])
            .then((data) => {
                const { first, last, role, manager } = data;
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
                const values = [first, last, role, manager];
                db.query(sql, values, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`${first} ${last} has successfully been added to the employee database.`);
                        init();
                    }
                });
            });
    }
    getManagersAndRoles();
};

inquirer
    .prompt([
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
        //TODO: Figure out employee options = = variable for choices
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
