var mysql = require("mysql");
var inquirer = require("inquirer");
const consoleTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "hello1234",
  database: "employee_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId); 
    showAll();
    myFunction();
  });

  function myFunction() {
    myVar = setTimeout(main_Menu, 1000);
  }

  function showAll() {
 
    connection.query("SELECT first_name AS FirstName , last_name as LastName , role.title as Role, role.salary AS Salary, department.name AS Department FROM employee INNER JOIN department ON department.id = employee.role_id left JOIN role ON role.id = employee.role_id", function (err, res) {
        console.table(res);
        if (err) throw err;
        main_Menu();
    }
    )};


    function sub_Menu(){
        inquirer
        .prompt({
            name: "choices",
            type: "list",
            message: "Would you like to continue?",
            choices: [
                "yes",
                "no"
            ]
        })
        .then(function (answer) {
            switch (answer.choices) {
    
                case "yes":
                    main_Menu();
                    break;
    
                    
                case "no":
                    process.exit();
                    break;
            }
        });
    }

function main_Menu() {

    inquirer
        .prompt({
            name: "choices",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View department",
                "View employees",
                "View roles",
                "Add departments",
                "Add roles",
                "Add employees",
                "Update employee roles"
            ]
        })
        .then(function (answer) {
            switch (answer.choices) {

                case "View department":
                    viewDepartment();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "View roles":
                    viewRole();
                    break;

                case "Add departments":
                    addDepartment();
                    break;

                case "Add roles":
                    addRoles();
                    break;

                case "Add employees":
                    addEmployees();
                    break;

                case "Update employee roles":
                    updateEmployee();
                    break;

            }
        });
}


  

function viewDepartment() {
     var query = "SELECT name FROM department";
    // connection.query(query, function (err, res) {
    //     console.log("in view dep");
    //     for (var i = 0; i < res.length; i++) {
    //         console.log(res[i].name);
    //     }
    connection.query(query, function (err, res) {
        console.table(res);
        if (err) throw err;
      
       
    });
    sub_Menu();
}
function viewEmployees() {
    var query = "SELECT first_name, last_name FROM employee";
    connection.query(query, function (err, res) {
        console.table(res);
        if (err) throw err;
       
    });
    sub_menu();
}
function viewRole() {
    var query = "SELECT title FROM role";
    connection.query(query, function (err, res) {
        console.table(res);
        if (err) throw err;
       
    });
    sub_menu();
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please add department"
        }
    ])
        .then(function (answer) {
            var query = "INSERT INTO department (name) VALUES ('" + answer.name + "');"
            connection.query(query, function (err, res) {
                console.log("Department added");
            })
            viewDepartment();
            main_Menu();
        });
}

function addRoles() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Please add title"
            },
            {
                type: "number",
                name: "salary",
                message: "Please add salary"
            },
            {
                type: "list",
                name: "choice",
                message: "Please choose existing roles",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push({ name: results[i].name, value: results[i].id });
                    }
                    return choiceArray;
                },
            }
        ])
            .then(function (answer) {
                console.log(answer);
                var query = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?);"
                connection.query(query, [answer.title, answer.salary, answer.choice], function (err, res) {
                    console.log(err);
                    console.log("Role added");
                    viewRole();
                    main_Menu();
                })
            });
    }
    )
};

function addEmployees() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Please add name"
            },
            {
                type: "input",
                name: "lastname",
                message: "Please add last name"
            },
            {
                type: "list",
                name: "role",
                message: "Please choose existing roles",
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < results.length; i++) {
                        roleArray.push({ name: results[i].title, value: results[i].id });
                    }
                    return roleArray;
                },
            }
        ])
            .then(function (answer) {
                console.log(answer);
                var query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,0);"
                connection.query(query, [answer.name, answer.lastname, answer.role], function (err, res) {
                    console.log(err);
                    console.log("Employee added");
                    viewEmployees();
                    sub_Menu();
                })
            });
    }
    )
};
 function updateEmployee() {
   
    var roleQuery = "SELECT * FROM role;";
    var departmentQuery = "SELECT * FROM department;";


    connection.query(roleQuery, function (err, roles) {
        connection.query(departmentQuery, function (err, departments) {

            if (err) throw err;
            inquirer.prompt([

                {
                    name: "new_Role",
                    type: "rawlist",
                    choices: function () {
                        var arr_Choices = [];
                        for (var i = 0; i < roles.length; i++) {
                            arr_Choices.push(roles[i].title);
                        }

                        return arr_Choices;
                    },
                    message: "Which Role would you like to update?"
                },
                {
                    name: "new_Salary",
                    type: "input",
                    message: "What is the new salary for this role?"

                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var arr_Choices = [];
                        for (var i = 0; i < departments.length; i++) {
                            arr_Choices.push(departments[i].name);
                        }
                        return arr_Choices;
                    },
                    message: "Which department this role belongs to?"
                },
            ]).then(function (result) {

                for (var i = 0; i < departments.length; i++) {
                    if (departments[i].name === result.choice) {
                        result.department_id = departments[i].id;
                    }
                }
                var query = "UPDATE role SET title=?,salary= ? WHERE department_id= ?"
                const new_vals = [

                    { title: result.newRole },
                    { salary: result.new_Salary },
                    { department_id: result.department_id }
                ]
                let query1 = connection.query(query, new_vals, function (err) {
                    if (err) throw err;
                    console.table("Role Successfuly Updated!");
                    
                });
                
            })
        })
        
    })
    sub_menu();
 };       