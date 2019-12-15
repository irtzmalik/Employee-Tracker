DROP DATABASE IF EXISTS employee_DB;
DROP Table IF EXISTS employee;
CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(10) NOT NULL,
  manager_id INT(10),
  PRIMARY KEY (id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY(role_id) REFERENCES role(id)
);
DROP table IF EXISTS department;

USE employee_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

DROP table IF EXISTS role;
USE employee_DB;

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,4) NOT NULL,
  department_id INT (10) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(department_id) REFERENCES department (id)
  
);