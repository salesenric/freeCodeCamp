let currentInput = "";
const display = document.getElementById("display");

const updateDisplay = () => {
  display.innerText = currentInput || "0";
};

const clearCalculator = () => {
  currentInput = "";
  updateDisplay();
};

const addToInput = (value) => {
  if (currentInput === "0" && value !== ".") {
    currentInput = value; // Replace if starting fresh
  } else {
    currentInput += value;
  }
  updateDisplay();
};

const calculateResult = () => {
  try {
    const result = eval(currentInput.replace(/(\d)(?=\d{2,})/g, "$1,"));
    currentInput = result.toString();
    updateDisplay();
  } catch {
    display.innerText = "Error";
    currentInput = "";
  }
};

const handleOperator = (operator) => {
  const lastChar = currentInput.slice(-1);
  const secondToLastChar = currentInput.slice(-2, -1);

  // If the last character is an operator (excluding "-"), replace it
  if ("+-*/".includes(lastChar)) {
    // Allow negative sign after an operator but prevent replacing with other operators
    if (
      operator === "-" &&
      !"+-*/".includes(secondToLastChar) &&
      lastChar === "-"
    ) {
      //nothing
    } else if (operator === "-" && !"+-*/".includes(secondToLastChar)) {
      currentInput += operator;
    } else if (operator !== "-" && "+-*/".includes(secondToLastChar)) {
      // Replace the second to last operator with the new one (no extra space)
      currentInput = currentInput.slice(0, -2) + operator;
    } else if (operator !== "-") {
      // Replace the last operator with the new one (no extra space)
      currentInput = currentInput.slice(0, -1) + operator;
    }
  } else {
    // If last character is not an operator, just add the new operator
    currentInput += operator;
  }

  updateDisplay();
};

// Event listeners
document.getElementById("clear").addEventListener("click", clearCalculator);

document.querySelectorAll('button[id^="number"]').forEach((button) => {
  button.addEventListener("click", () => addToInput(button.innerText));
});

document
  .querySelectorAll(
    'button[id="add"], button[id="subtract"], button[id="multiply"], button[id="divide"]'
  )
  .forEach((button) => {
    button.addEventListener("click", () => handleOperator(button.innerText));
  });

document.getElementById("equals").addEventListener("click", calculateResult);
document.getElementById("decimal").addEventListener("click", () => {
  // Split the current input into parts (numbers and operators)
  const parts = currentInput.split(/([+\-*/])/);

  // Get the last part to check if it's a number
  const lastPart = parts[parts.length - 1];

  // Check if the last part is a number and does not contain a decimal point
  if (!lastPart.includes(".") && !isNaN(lastPart)) {
    currentInput += ".";
    updateDisplay();
  }
});

// Number buttons
const numberButtons = [
  { id: "zero", value: "0" },
  { id: "one", value: "1" },
  { id: "two", value: "2" },
  { id: "three", value: "3" },
  { id: "four", value: "4" },
  { id: "five", value: "5" },
  { id: "six", value: "6" },
  { id: "seven", value: "7" },
  { id: "eight", value: "8" },
  { id: "nine", value: "9" }
];

numberButtons.forEach((button) => {
  document
    .getElementById(button.id)
    .addEventListener("click", () => addToInput(button.value));
});
