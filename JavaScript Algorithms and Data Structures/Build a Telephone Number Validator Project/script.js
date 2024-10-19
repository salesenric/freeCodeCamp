const userInput = document.getElementById("user-input");
const checkBtn = document.getElementById("check-btn");
const clearBtn = document.getElementById("clear-btn");
const result = document.getElementById("results-div");

const checkUserInput = () => {

  const inputValue = userInput.value;
  const phoneRegex = /^1?\s?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;


  if (!inputValue) {
    alert("Please provide a phone number");
    return;
  } else if (phoneRegex.test(inputValue)) {
    result.textContent = "Valid US number: " + inputValue;
    return;
  } else {
    result.textContent = "Invalid US number: " + inputValue;
    return;
  }
};

const clearOutput = () => {
  result.textContent="";
  userInput.value = "";
}

checkBtn.addEventListener("click", checkUserInput);
clearBtn.addEventListener("click", clearOutput);
