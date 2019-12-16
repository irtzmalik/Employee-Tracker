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
 
  });



  function showAll() {
 
    connection.query("SELECT first_name AS FirstName , last_name as LastName , role.title as Role, role.salary AS Salary, department.name AS Department FROM employee INNER JOIN department ON department.id = employee.role_id left JOIN role ON role.id = employee.role_id", function (err, res) {
        console.table(res);
        if (err) throw err;
        main_Menu();
    }
    )};


    

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
                "Update employee roles",
                "Delete",
                "View Department Total Budget",
                "Show Everything of Employee",
                "Show Everything of Role",
                "Show Everything of Department"
              
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
                
                case "Delete":
                    Delete_Choices();
                    break;

                case "View Department Total Budget"   :
                    total_budget_dept();
                    break;

                case "Show Everything of Employee"   :
                    view_all_employee();
                    break;
                    
                case "Show Everything of Role"   :
                    view_all_role();
                    break;

                case "Show Everything of Department"   :
                    view_all_department();
                    break;            

            }
        });
}


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
  

function viewDepartment() {
     var query = "SELECT name FROM department";
    // connection.query(query, function (err, res) {
    //     console.log("in view dep");
    //     for (var i = 0; i < res.length; i++) {
    //         console.log(res[i].name);
    //     }
    connection.query(query, function (err, res) {
       
        if (err) throw err;
      
        console.table(res);
        sub_Menu();
    });
    
   

}
function viewEmployees() {
    console.log('\n'.repeat(999));
    var query = "SELECT concat(concat(first_name,' ',last_name)) as Employee_name FROM employee";
    connection.query(query, function (err, res) {
       
        if (err) throw err;
        console.table(res);
        sub_Menu();
       
    })
   // sub_Menu()
    
}
function viewRole() {
    var query = "SELECT title FROM role";
    connection.query(query, function (err, res) {
       
        if (err) throw err;
         console.table(res);
         sub_Menu();
       
    });
   
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
         sub_Menu();
        });
}

function addRoles() {
    connection.query("SELECT * FROM department", function (err, results) {
       //
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
                message: "Please choose existing department to associate the new role:",
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
                    //console.log(err);
                    console.log("Role added\n New Role List:\n");
                    viewRole();
                   sub_Menu();
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
                var query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?);"
                connection.query(query, [answer.name, answer.lastname, answer.role], function (err, res) {
                   // console.log(err);
                    console.log("Employee added");
                    viewEmployees();
                    
                })
            });
    }
    )
};
 function updateEmployee() {
    //  connection.query("SELECT * FROM employee", function (err, results) {
    //      if (err) throw err;
    //      inquirer.prompt([
    //          {
    //              type: "list",
    //              name: "role",
    //              message: "Please choose existing employee",
    //              choices: function () {
    //                  var employeeArray = [];
    //                  for (var i = 0; i < results.length; i++) {
    //                      employeeArray.push({ name: results[i].first_name + " " + results[i].last_name, value: results[i].id });
    //                  }
    //                  return employeeArray;
    //              }
    //          },            
    //      ])
    //          .then(function (answer) {
    //              console.log(answer);
    //          });
    //  })
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
                    sub_Menu();
                    
                });
                
            })
        })
        
    })
  
 }; 


 function delete_Department()
 {
    //view_all_department();
     
    inquirer.prompt([
        {
            type: "input",
            name: "dept_name",
            message: "What do you want to delete"
        }
    ]).then(function (answer) {
        // var query_1 = "SELECT * FROM department;"
       

     
        // connection.query(query_1, function (err, res) {
        //     // console.log(err);
        //      console.table(res);
            
            
        //  });
        console.log("Here "+answer.dept_name);
        var query = "DELETE FROM department WHERE name = '" + answer.dept_name + "';"
       

     
        connection.query(query, function (err, res) {
            // console.log(err);
             console.log("Department deleted");
            
            
         });
            
            
         sub_Menu();

    });
        

 }

 function delete_role()
 {
    inquirer.prompt([
        {
            type: "number",
            name: "role_id",
            message: "Enter Role Id to delete"
        }
    ]).then(function (answer) {
        //console.log("Here "+answer.role_id);
        var query = "DELETE FROM role WHERE id = '" + answer.role_id + "';"

        connection.query(query, function (err, res) {
           // console.log(err);
            console.log("role deleted");
           sub_Menu();
           
        });

    });
        

 }

 function view_all_employee()
 {
 
    var query = "SELECT * FROM employee;"

        connection.query(query, function (err, res) {
           // console.log(err);
            console.table(res);
            sub_Menu();
        });

 }

 function view_all_role()
 {
 
    var query = "SELECT * FROM role;"

        connection.query(query, function (err, res) {
           // console.log(err);
            console.table(res);
            sub_Menu();
        });

 }

 function view_all_department()
 {
 
    var query = "SELECT * FROM department;"

        connection.query(query, function (err, res) {
           // console.log(err);
            console.table(res);
            sub_Menu();
        });

 }

 function delete_employee()
 {
    inquirer.prompt([
        {
            type: "number",
            name: "employee_id",
            message: "Write empolyee Id to Delete "
        }
    ]).then(function (answer) {
       // console.log("Here "+answer.employee_id);
        var query = "DELETE FROM role WHERE id = '" + answer.employee_id + "';"

        connection.query(query, function (err, res) {
            console.log(err);
            console.log("role deleted");
           // viewRole();
           
        });
        

    });
        

 }
 
 function Delete_Choices()
 {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to delete?",
        choices: [
            "Delete Department",
            "Delete Role",
            "Delete Employee"
        ]
    })
        .then(function (answer) {
          
            switch (answer.choices) {

                case "Delete Department":
                    delete_Department();
                    break;

                case "Delete Role":
                    delete_role();
                    break;

                case "Delete Employee":
                    delete_employee();
                    break;

              

            }
        });
 }

 function total_budget_dept()
 {

    var query = "select SUM(r.salary) as total_budget from department d  join role r ON d.id=r.department_id join employee emp on emp.role_id= r.id;"

    connection.query(query, function (err, res) {
        
   // var result= JSON.parse(res);
   console.table(res);
        sub_Menu();
    });


 }