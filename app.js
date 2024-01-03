// Added local storage
// Used array for output (transaction history)

// ////////////////////////////////////////////////////////////////////////

// ERROR MESSAGE

let errMsgElement = document.getElementById("errorMessage");

// v2
function err(type, msg) {
    if (type == 1) {
        errMsgElement.textContent = msg;
        errMsgElement.style.display = "block";    
    }
    else {
        errMsgElement.textContent = "";
        errMsgElement.style.display = "none";
    }
}

// v1
// function showError(message) {
//     errMsgElement.textContent = message;
//     errMsgElement.style.display = "block";
// }

// function clearError() {
//     errMsgElement.textContent = "";
//     errMsgElement.style.display = "none";
// }
// ////////////////////////////////////////////////////////////////////////

// CALCULATION 

let balanceElement = document.getElementById("balance");
let depositElement = document.getElementById("deposit");
let depositAmtElement = document.getElementById("depositAmt");
let withdrawElement = document.getElementById("withdraw");
let withdrawAmtElement = document.getElementById("withdrawAmt");

document.getElementById("depositBtn").onclick = function() {
    let currentBalance = parseFloat (balanceElement.innerHTML);
    depositAmt = parseFloat (depositAmtElement.value);

    if (isNaN(depositAmt) || depositAmt <= 0) {
        err(1, "Please enter a valid deposit amount.");
        // v1 // showError("Please enter a valid deposit amount.");
    }
    else { 
        err(0, "");
        // v1 // clearError();

        depositElement.innerHTML = depositAmt.toFixed(2);
        let newBalance = currentBalance + depositAmt;
        balanceElement.innerHTML = newBalance.toFixed(2);

        // Add transaction history
        createTransactionItem("Deposit", depositAmt, newBalance);
    }

    depositAmtElement.value = "";
    withdrawElement.innerHTML = "0.00";
    
}

document.getElementById("withdrawBtn").onclick = function() {
    let currentBalance = parseFloat (balanceElement.innerHTML);
    withdrawAmt = parseFloat (withdrawAmtElement.value);
            
    if (isNaN(withdrawAmt)) {
        err(1, "Please enter a valid withdraw amount.")
        // showError("Please enter a valid withdraw amount.");
    }
    else if (withdrawAmt > currentBalance) {
        err(1, "Insufficient cash! Please enter a valid withdraw amount.");
        // showError("Insufficient cash! Please enter a valid withdraw amount.");
    }
    else {
        err(0, "");
        //clearError();

        withdrawElement.innerHTML = withdrawAmt.toFixed(2);
        let newBalance = currentBalance - withdrawAmt;
        balanceElement.innerHTML = newBalance.toFixed(2);

        // Add transaction history
        createTransactionItem("Withdraw", withdrawAmt, newBalance);
    }
            
    withdrawAmtElement.value = "";
    depositElement.innerHTML = "0.00";
}
// ////////////////////////////////////////////////////////////////////////

// TRANSACTION HISTORY

let transactionTable = document.getElementById("transactionTable");
let transactionId = getIdFromData();

function getCurrentDate() {
    let currentDate = new Date();
    return currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
    // return currentDate.toLocaleDateString();
}

function addNoTransactionRow() {
    let row = transactionTable.insertRow(-1);
    row.classList.add("noTransaction");
    let cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.classList.add("fw-light", "fst-italic")
    cell.textContent = "There is no transaction history.";
}

function removeNoTransactionRow() {
    const row = document.querySelector(".noTransaction");
    if (row) {
        row.remove();
    }
}

function addTransactionRow(id, type, amount, bal, date) {
    // create a new row at the end of the table
    let row = transactionTable.insertRow(-1);

    let transactionList = [id, type, amount, bal, date];
    let cellCounter = 0;

    transactionList.forEach( ( value => {
        if (cellCounter == 2 || cellCounter == 3) {
            row.insertCell(cellCounter++).textContent = `$${value.toFixed(2)}`;    
        }
        else {
            row.insertCell(cellCounter++).textContent = value;
        }
    }))

    // attempt 1
    // // add cells to the row
    // let idCell = row.insertCell(0);
    // let typeCell = row.insertCell(1);
    // let amtCell = row.insertCell(2);
    // let balCell = row.insertCell(3);
    // let dateCell = row.insertCell(4);

    // // populate cell with data
    // idCell.textContent = id;
    // typeCell.textContent = type;
    // amtCell.textContent = `$${amount.toFixed(2)}`;
    // balCell.textContent = `$${bal.toFixed(2)}`;
    // dateCell.textContent = date;
}

function createTransactionItem(transactionType, amount, balance) {
    
    removeNoTransactionRow();

    // Show result on document
    addTransactionRow(transactionId, transactionType, amount, balance, getCurrentDate());

    // Set data in local storage
    setData(transactionId, transactionType, amount, balance, getCurrentDate());

    transactionId++;
} 

// ////////////////////////////////////////////////////////////////////////

// LOCAL STORAGE

/*
localStorage.setItem("deposit", "200")
localStorage.getItem("deposit")
localStorage.removeItem("deposit")
localStorage.clear()
*/

/*
const users = [
    {"name": "Alice"},
    {"name": "Bob"}
]
users.map( index => console.log(index.name) )
*/

let data = getData();

data.map(item => addTransactionRow(item.id, item.type, item.amt, item.bal, item.time));

function getData() {
    // convert Object to String | if no data, return empty array
    return JSON.parse(localStorage.getItem("transactionData")) || [];
}

function setData(id, type, amt, bal, time) {
    let data = getData();                   // read current data
    data.push({id, type, amt, bal, time});       // add obj into current data
    localStorage.setItem("transactionData", JSON.stringify(data)); // convert Object to String
}

function getIdFromData() {
    let data = getData();

    if (data.length === 0) {
        return 1;
    }

    // --- One way of getting last item ---

    // v1
    // const dataCopy = [...data];
    // const lastItem = dataCopy.pop();    // remove last item from array
    // const maxId = lastItem.id;
    // return maxId + 1;

    // v2
    // const dataCopy = [...data];
    // return dataCopy.pop().id + 1;

    // --- Alternative way of getting last item ---
    return data[data.length - 1].id + 1;
}

window.onload = function() {

    let data = getData();
    
    if (data.length > 0) {        
        // Add previous transactions to the table -- no need this b/c of let data = getData();
        // data.map(item => addTransactionToTable(item.id, item.type, item.amt, item.bal, item.time));

        // Show the last balance on the screen
        let lastBalance = data[data.length -1].bal;
        balanceElement.innerHTML = lastBalance.toFixed(2);
    }
    else {
        addNoTransactionRow();
    }
}

// ////////////////////////////////////////////////////////////////////////