INSERT INTO department (name)
VALUES ("Software Engineer");

INSERT INTO department (name)
VALUES ("AI");

INSERT INTO department (name)
VALUES ("QA");
INSERT INTO department (name)
VALUES ("UI");

INSERT INTO department (name)
VALUES ("PR");


INSERT INTO role (title, salary, department_id )
VALUES ("Software Developer", 80000.00, 1);

INSERT INTO role (title, salary, department_id )
VALUES ("AI", 60000.00, 2);

INSERT INTO role (title, salary, department_id )
VALUES ("Front End", 50000.00, 3);

INSERT INTO role (title, salary, department_id) 
VALUES ("Lead Engineer", 95000,4);


INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Haris", "Laghari", 2);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Irtaza", "Malik", 3);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Wick", 4);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kratos", "Olmpiyan", 1);