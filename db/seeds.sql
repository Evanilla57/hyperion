INSERT INTO department (dept_name)
VALUES 
    ('Accounting'),
    ('Sales'),
    ('Human Resources'),
    ('Legal'),
    ('Customer Service');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Accountant', 50000.00, 1),
    ('Accounting Manager', 75000.00, 1),
    ('Sales Specialist', 60000.00, 2),
    ('Sales Manager', 80000.00, 2),
    ('HR Specialist', 70000.00, 3),
    ('HR Manager', 90000.00, 3),
    ('Legal Assistant', 80000.00, 4),
    ('Legal Manager', 120000.00, 4),
    ('Customer Service Rep', 50000.00, 5),
    ('Customer Service Manager', 75000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Luffy', 'Kaladin', 2, NULL),
    ('Zoro','Shallan', 4, NULL),
    ('Usopp', 'Dalinar', 6, NULL),
    ('Nami', 'Jasnah', 8, NULL),
    ('Nico', 'Navani', 10, NULL),
    ('Robin', 'Szeth', 1, 1),
    ('Franky', 'Taravangian', 1, 1),
    ('Brook', 'Rock', 3, 2),
    ('Jimbei', 'Wit', 3, 2),
    ('Tony', 'Sylphrena', 5, 3),
    ('Tony', 'Pattern', 5, 3),
    ('Chopper', 'Lift', 7, 4),
    ('Vivi', 'Adolin', 7, 4),
    ('Yamato', 'Renarin', 9, 5),
    ('Carrot', 'Tien', 9, 5);