// ERROR MESSAGE

let errMsgElement = document.getElementById("errorMessage");

function showError(message) {
    errMsgElement.textContent = message;
    errMsgElement.style.display = "block";
}

function clearError() {
    errMsgElement.textContent = "";
    errMsgElement.style.display = "none";
}
// ////////////////////////////////////////////////////////////////////////

// CALCULATION 

let balanceElement = document.getElementById("balance");
let depositElement = document.getElementById("deposit");
let depositAmtElement = document.getElementById("depositAmt");
let withdrawElement = document.getElementById("withdraw");
let withdrawAmtElement = document.getElementById("withdrawAmt");

document.getElementById("depositBtn").onclick = function() {
    removeNoTransactionRow();   // not working!!

    let currentBalance = parseFloat (balanceElement.innerHTML);
    depositAmt = parseFloat (depositAmtElement.value);

    if (isNaN(depositAmt) || depositAmt <= 0) {
        showError("Please enter a valid deposit amount.");
    }
    else {                
        clearError();
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
        showError("Please enter a valid withdraw amount.");
    }
    else if (withdrawAmt > currentBalance) {
        showError("Insufficient cash! Please enter a valid withdraw amount.");
    }
    else {
        clearError();
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
    // return currentDate.toLocaleDateString();
    return currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
}

function createTransactionItem(transactionType, amount, balance) {
    
    removeNoTransactionRow();
    addTransactionToTable(transactionId, transactionType, amount, balance, getCurrentDate());

    // set data in local storage
    setData(transactionId, transactionType, amount, balance, getCurrentDate());

    transactionId++;
} 

function addTransactionToTable(id, type, amount, bal, date) {
    // create a new row at the end of the table
    let row = transactionTable.insertRow(-1);

    // add cells to the row
    let idCell = row.insertCell(0);
    let typeCell = row.insertCell(1);
    let amtCell = row.insertCell(2);
    let balCell = row.insertCell(3);
    let dateCell = row.insertCell(4);

    // populate cell with data
    idCell.textContent = id;
    typeCell.textContent = type;
    amtCell.textContent = "$" + amount.toFixed(2);
    balCell.textContent = "$" + bal.toFixed(2);
    dateCell.textContent = date;
}

function addNoTransactionRow() {
    let row = transactionTable.insertRow(-1);
    row.classList.add("noTransaction"); // not working!!
    let cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.classList.add("fw-light", "fst-italic")
    cell.textContent = "There is no transaction history.";
}

// not working!!
function removeNoTransactionRow() {
    const row = document.querySelector("noTransaction");
    if (row) {
        row.remove();
    }
}
// ////////////////////////////////////////////////////////////////////////

// LOCAL STORAGE

let data = getData();

data.map(item => addTransactionToTable(item.id, item.type, item.amt, item.bal, item.time));

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

    const dataCopy = [...data];
    const lastItem = dataCopy.pop();    // remove last item from array
    const maxId = lastItem.id;

    return maxId + 1;
}

window.onload = function() {

    let data = getData();
    
    if (data.length > 0) {        
        // Add previous transactions to the table
        // data.map(item => addTransactionToTable(item.id, item.type, item.amt, item.bal, item.time));

        // Show the last balance on the screen
        let lastBalance = data[data.length -1].bal;
        balanceElement.innerHTML = lastBalance.toFixed(2);
    }
    else {
        addNoTransactionRow();
    }
}

// LOCAL STORAGE        
// localStorage.setItem("deposit", "200")
// localStorage.getItem("deposit")
// localStorage.removeItem("deposit")
// localStorage.clear()

// ////////////////////////////////////////////////////////////////////////