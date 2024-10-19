// First version in .css (!)

// Define global variables for price and cash in drawer (cid)
let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

document.getElementById("price").innerHTML = `Total price: <strong>$${price}</strong>`;

// Add an event listener to the purchase button
document.getElementById('purchase-btn').addEventListener('click', function() {

    // Get the cash value from the input field and parse it as a float
    const cash = parseFloat(document.getElementById('cash').value);
    
    // Create a deep copy of cid to preserve the original data
    let currentCid = cid.map(arr => arr.slice());

    /**
     * Function to calculate the change due based on the price, cash provided, and cash in drawer (cid)
     * @param {number} price - The price of the item
     * @param {number} cash - The cash provided by the customer
     * @param {Array} cid - The current cash in drawer
     * @returns {Object} - Contains the status of the transaction, change to return, and remaining cash in drawer
     */
    function calculateChange(price, cash, cid) {

        document.getElementById("price").innerHTML = `Total price: <strong>$${price}</strong>`;

        let changeDue = parseFloat((cash - price).toFixed(2)); // Calculate the amount of change due
        if (changeDue < 0) {
            // If not enough cash is provided, alert the user and return insufficient funds status
            alert("Customer does not have enough money to purchase the item");
            return {status: "INSUFFICIENT_FUNDS", change: [], remainingCid: cid};
        } else if (changeDue === 0) {
            // If exact amount is provided, return a message indicating no change is due
            return {status: "No change due - customer paid with exact cash", change: [], remainingCid: cid};
        } else {
            const changeArray = []; // Array to hold the change to return
            let status = "OPEN"; // Default status
            const denominations = [
                ["ONE HUNDRED", 100],
                ["TWENTY", 20],
                ["TEN", 10],
                ["FIVE", 5],
                ["ONE", 1],
                ["QUARTER", 0.25],
                ["DIME", 0.1],
                ["NICKEL", 0.05],
                ["PENNY", 0.01]
            ];

            // Calculate the total cash available in the drawer
            let totalCid = parseFloat(cid.reduce((acc, curr) => acc + curr[1], 0).toFixed(2));

            // Check if total cash in drawer is less than the change due
            if (totalCid < changeDue) {
                status = "INSUFFICIENT_FUNDS";
                return {status: status, change: [], remainingCid: cid};
            }

            // Reverse the cid array for easier processing (start from largest denomination)
            cid = cid.reverse();
            for (let i = 0; i < denominations.length; i++) {
                let coinName = denominations[i][0];
                let coinValue = denominations[i][1];
                let coinAvailable = cid[i][1];
                let coinAmount = 0;

                // Calculate how much of each denomination is used to make up the change due
                while (changeDue >= coinValue && coinAvailable > 0) {
                    changeDue -= coinValue;
                    changeDue = parseFloat(changeDue.toFixed(2));
                    coinAvailable -= coinValue;
                    coinAmount += coinValue;
                }

                // If any amount of the coin is used, add it to the change array
                if (coinAmount > 0) {
                    changeArray.push([coinName, parseFloat(coinAmount.toFixed(2))]);
                    cid[i][1] = parseFloat(coinAvailable.toFixed(2)); // Update the remaining amount of the coin in the drawer
                }
            }

            // Check if the remaining change due is zero
            if (changeDue > 0) {
                status = "INSUFFICIENT_FUNDS";
                return {status: status, change: [], remainingCid: cid.reverse()};
            }

            // If total cash in drawer equals the change due, return closed status
            if (totalCid === parseFloat((cash - price).toFixed(2))) {
                status = "CLOSED";
                return {status: status, change: changeArray.reverse(), remainingCid: cid.reverse()};
            }

            return {status: "OPEN", change: changeArray, remainingCid: cid.reverse()};
        }
    }

    // Call the calculateChange function with the provided values
    const result = calculateChange(price, cash, currentCid);

    // Update the DOM based on the result status
    if (result.status === "INSUFFICIENT_FUNDS") {
        document.getElementById('change-due').innerText = "Status: INSUFFICIENT_FUNDS";
    } else if (result.status === "No change due - customer paid with exact cash") {
        document.getElementById('change-due').innerText = result.status;
    } else {
        // Construct the change message and update the DOM
        let changeMessage = `Status: ${result.status}`;
        result.change.forEach(coin => {
            changeMessage += ` ${coin[0]}: $${coin[1]}`;
        });
        document.getElementById('change-due').innerText = changeMessage;

        // Construct the remaining cash message and update the DOM
        let remainingCashMessage = "Remaining Cash in Drawer: ";
        result.remainingCid.forEach(coin => {
            remainingCashMessage += ` ${coin[0]}: $${coin[1]}`;
        });
        document.getElementById('remaining-cash').innerText = remainingCashMessage;
    }
});
