var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('markdown-table');
var products = ["id","product","department","price","stock"];
var tableArray = [products];


//connect to database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
});

//Promt Manager for Task
function doWhat() {
    inquirer.prompt([
        {
            type: "list",
            message: "What task would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "task"
        }
    ]).then(function(inquirerResponse) {
        // console.log(inquirerResponse.item);
        //switch to determine action based on first argument
        switch (inquirerResponse.task) {
            case "View Products for Sale":
            viewProducts();
            break;
            
            case "View Low Inventory":
            lowInventory();
            break;
            
            case "Add to Inventory":
            addInventory();
            break;
            
            case "Add New Product":
            addProduct();
            break;
            
            default:
                console.log("Invalid Argument");
            }
    });
}

//view all products function
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        //clear out products array
        tableArray = [products];
        var tempArray = [];

        //goes through items and lists products in table array
        for (var i = 0; i < res.length; i++) {
            tempArray = [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
            tableArray.push(tempArray);
        }
        console.log("\n" + table(
            tableArray
            ) + "\n")
        doWhat();
    });
}

//view low inventory function
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        
        //clear out products array
        tableArray = [products];
        var tempArray = [];

        //goes through items and lists products in table array
        for (var i = 0; i < res.length; i++) {
            tempArray = [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity];
            tableArray.push(tempArray);
        }
        console.log("\n" + table(
            tableArray
            ) + "\n")
        doWhat();
    });
}

//add to inventory function


//add new product function
doWhat();