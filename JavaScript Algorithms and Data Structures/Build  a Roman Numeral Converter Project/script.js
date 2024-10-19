const numberInput = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("output");

const arabicToRoman = (input) => {
  switch (true) {
    case (input>=1000):
      return "M" + arabicToRoman(Math.floor(input-1000));
    case (input>=900):
      return "CM" + arabicToRoman(Math.floor(input-900));
    case (input>=500):
      return "D" + arabicToRoman(Math.floor(input-500));
    case (input>=400):
      return "CD" + arabicToRoman(Math.floor(input-400));
    case (input>=100):
      return "C" + arabicToRoman(Math.floor(input-100));
    case (input>=90):
      return "XC" + arabicToRoman(Math.floor(input-90));
    case (input>=50):
      return "L" + arabicToRoman(Math.floor(input-50));
    case (input>=40):
      return "XL" + arabicToRoman(Math.floor(input-40));
    case (input>=10):
      return "X" + arabicToRoman(Math.floor(input-10));
    case (input>=9):
      return "IX" + arabicToRoman(Math.floor(input-9));
    case (input>=5):
      return "V" + arabicToRoman(Math.floor(input-5));
    case (input>=4):
      return "IV" + arabicToRoman(Math.floor(input-4));
    case (input>=1):
      return "I" + arabicToRoman(Math.floor(input-1));
    case (input===0):
      return "";
    default:
      return "";
  }
};

const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value);

  if (!numberInput.value || isNaN(inputInt)) {
    result.textContent ="Please enter a valid number";
    return;
  } else if (inputInt < 1){
    result.textContent ="Please enter a number greater than or equal to 1";
    return;
  } else if (inputInt > 3999){
    result.textContent ="Please enter a number less than or equal to 3999";
    return;
  }

  result.textContent = arabicToRoman(inputInt);
  numberInput.value = "";
};

convertBtn.addEventListener("click", checkUserInput);

numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});
