function ConvertHandler() {

  this.getNum = function(input) {
    let result = input.match(/[.\d\/]+/g) || ["1"];
    result = result[0];

    if (result.includes("/")) {
      let nums = result.split("/");
      if (nums.length != 2) {
        return "invalid number";
      }
      result = parseFloat(nums[0]) / parseFloat(nums[1]);
    }
    return isNaN(result) ? "invalid number" : parseFloat(result);
  };

  this.getUnit = function(input) {
    let result = input.match(/[a-zA-Z]+/g);
    if (!result) return "invalid unit";

    result = result[0].toLowerCase();
    const validUnits = ["gal", "l", "mi", "km", "lbs", "kg"];
    if (validUnits.includes(result)) {
      return result === "l" ? "L" : result; // Normalize 'l' to 'L'
    }
    return "invalid unit";
  };

  this.getReturnUnit = function(initUnit) {
    const unitMap = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs"
    };
    return unitMap[initUnit] || "invalid unit";
  };

  this.spellOutUnit = function(unit) {
    const spellOutMap = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms"
    };
    return spellOutMap[unit] || "invalid unit";
  };

  this.convert = function(initNum, initUnit) {
    const conversionRates = {
      gal: 3.78541,
      L: 1 / 3.78541,
      mi: 1.60934,
      km: 1 / 1.60934,
      lbs: 0.453592,
      kg: 1 / 0.453592
    };
    let result = initNum * conversionRates[initUnit];
    return parseFloat(result.toFixed(5));
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const spelledInitUnit = this.spellOutUnit(initUnit);
    const spelledReturnUnit = this.spellOutUnit(returnUnit);
    return `${initNum} ${spelledInitUnit} converts to ${returnNum} ${spelledReturnUnit}`;
  };

}

module.exports = ConvertHandler;
