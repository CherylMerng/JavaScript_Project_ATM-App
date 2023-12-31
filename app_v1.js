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
        showError("Please enter a valid deposit amount.");
    }
    else {                
        clearError();
        depositElement.innerHTML = depositAmt.toFixed(2);
        let newBalance = currentBalance + depositAmt;
        balanceElement.innerHTML = newBalance.toFixed(2);

        // Add transaction history
        createTransactionItem("Deposit", depositAmt);
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
        createTransactionItem("Withdraw", withdrawAmt);
    }
            
    withdrawAmtElement.value = "";
    depositElement.innerHTML = "0.00";
}

// TRANSACTION HISTORY

let transactionTable = document.getElementById("transactionTable");
let transactionId = 1;

function getCurrentDate() {
    let currentDate = new Date();
    // return currentDate.toLocaleDateString();
    return currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();
}

function createTransactionItem(transactionType, amount) {
    
    let transactionTitleElement = document.getElementById("transactionTitle");
    transactionTitleElement.style.display = "block";

    addTransactionToTable(transactionId++, transactionType, amount, getCurrentDate());

} 

function addTransactionToTable(id, type, amount, date) {
    // create a new row at the end of the table
    let row = transactionTable.insertRow(-1);

    // add cells to the row
    let cellId = row.insertCell(0);
    let cellType = row.insertCell(1);
    let cellAmount = row.insertCell(2);
    let cellDate = row.insertCell(3);

    // populate cell with data
    cellId.textContent = id;
    cellType.textContent = type;
    cellAmount.textContent = "$" + amount.toFixed(2);
    cellDate.textContent = date;
}