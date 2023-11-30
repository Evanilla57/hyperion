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
            const { mainMenu } = data;
            switch (mainMenu) {
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

// Allows user to add employee
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

//Function to allow user to add a role
function addRole() {
    let departments = [];
    async function getDepartment() {
        try {
        //query for departments.
        const departmentsQuery = await new Promise((resolve, reject) => {
        db.query('SELECT id, dept_name FROM department', (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
        });

        departments = departmentsQuery.map(({ id, dept_name }) => ({
            name: dept_name,
            value: id,
        }));
        promptUserInput();
    }
        catch (err){
            console.error(err);
        }
    }
    function promptUserInput() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title of this new role?'
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Select a salary range between 50,000.00 and 200,000.00 for this role.',
                    validate: async (number) => {
                        if (number <= 200000 && number >= 50000) {
                            return true;
                            
                        } else {
                            console.log('Salary must be between 50,000 and 200,000!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: departments
                }
            ])
            .then( async (data)=> {
                const {title, salary, department} = data;
                //retrieves dept name by id.
                const dept = departments.find(d => d.value === department).name;

                const sql = `INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?)`;
                const values = [title, salary, department];
                db.query(sql, values, (err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`${title} successfully added to ${dept} .`);
                        init();
                    }
                })
            })
    }
    getDepartment();
};

//Allows user to add department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of this new department?'
            }
        ])
        .then((data)=>{
            const {department} = data;
            const sql = `INSERT INTO department(dept_name)
                VALUES (?)`;
            db.query(sql, department, (err, res)=> {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`${department} successfully added.`);
                    init();
                }
            })
        })
};

//Allows user to update employer role
function updateEmployee() {
    let employee = [];
    const sqlE = `SELECT id, CONCAT(first_name, ' ', last_name) AS emp_name FROM employee`;
    const sqlR = `SELECT id, title FROM roles`;
    async function getEmployeeAndRole() {
        try {
            const employeeQuery = await new Promise((resolve, reject) => {
                db.query(sqlE, (err, res) =>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                } )
            })
            employee = employeeQuery.map(({id, emp_name})=> ({
                name: emp_name,
                value: id
            }))
            const rolesQuery = await new Promise((resolve, reject) => {
                db.query(sqlR, (err, res) =>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            })
            role = rolesQuery.map(({id,title})=> ({
                name: title,
                value: id
            }))
            promptUserInput();
        } catch (err) {
            console.error(err);
        }
    }
    function promptUserInput() {
        inquirer
            .prompt([
                {
                    type:'list',
                    name: 'employeeID',
                    message: `Select an employee with a role that you would like to update.`,
                    choices: employee
                },
                {
                    type: 'list',
                    name: 'roleID',
                    message: `Select a new role for this employee`,
                    choices: role
                }
            ])
            .then( async (data)=> {
                const {employeeID, roleID} = data;

                //retreives the emloyee's name and new role using IDs.
                const empName = employee.find(emp => emp.value === employeeID).name;
                const roleTitle = role.find(rl => rl.value === roleID).name;

                const sql =`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`;
                db.query(sql, (err, res)=> {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`${empName}'s role was updated to ${roleTitle}.`);
                        init();
                    }
                })
            });
    };
    getEmployeeAndRole();
};
