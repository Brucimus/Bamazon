var inquirer = require('inquirer');
var mysql = require('mysql');
var table = require('markdown-table');
var purchaseItem = "";
var purchasePrice = 0;
var originalQty = 0;
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

//Display existing table
function displayProducts() {
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
        // console.log(res);
        buyWhat();
    });
}

//grab data function
function grabData(item,amount) {
    connection.query("SELECT * FROM products WHERE ?",
    [
        {
            id: item
        }
    ]
    , function(err, res) {
        if (err) throw err;
        purchaseItem = res[0].product_name;
        originalQty = res[0].stock_quantity;
        purchasePrice = res[0].price;
        updateProduct(item,amount,purchaseItem,purchasePrice);
    })
}

//Update product function
function updateProduct(item, amount, productName,productPrice) {
    // console.log("Updating...\n");
    // console.log(originalQty);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
        {
            stock_quantity: originalQty - amount
        },
        {
            id: item
        }
        ],
        function(err, res) {
        if (err) throw err;
        // console.log(res);
        console.log("\nPurchased: " + productName + "\nPurchased Qty: " + amount + "\nTotal Cost: $" + (amount * productPrice))
        displayProducts();
        }
    );

}


//Promt users of what they want to do
function buyWhat() {
    inquirer.prompt([
        {
            type: "input",
            message: "What would you like to buy?",
            name: "item"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "qty"
        }
    ]).then(function(inquirerResponse) {
        // console.log(inquirerResponse.item);
        grabData(inquirerResponse.item, inquirerResponse.qty);
        // updateProduct(inquirerResponse.item, inquirerResponse.qty);
    });
}

//listen for id of item they want to buy

//listen for qty of the item they want to buy

//if not enough quantity, display "Insufficient Quantity" then prevent transaction

//if enough quantity, display total cost of transaction and reduce from stock
displayProducts();
