class SudokuSolver {
  validate(puzzleString) {
      if (puzzleString.length !== 81) {
          return { error: 'Expected puzzle to be 81 characters long' };
      }

      // Check for invalid characters
      if (/[^1-9.]/.test(puzzleString)) {
          return { error: 'Invalid characters in puzzle' };
      }

      // Check for duplicates in rows, columns, and regions
      for (let i = 0; i < 9; i++) {
          const row = puzzleString.slice(i * 9, i * 9 + 9);
          const col = puzzleString[i] + puzzleString[i + 9] + puzzleString[i + 18] + 
                      puzzleString[i + 27] + puzzleString[i + 36] + puzzleString[i + 45] + 
                      puzzleString[i + 54] + puzzleString[i + 63] + puzzleString[i + 72];

          const region = puzzleString.slice(Math.floor(i / 3) * 27 + (i % 3) * 3, 
                                             Math.floor(i / 3) * 27 + (i % 3) * 3 + 3) +
                         puzzleString.slice(Math.floor(i / 3) * 27 + (i % 3) * 3 + 9, 
                                             Math.floor(i / 3) * 27 + (i % 3) * 3 + 12) +
                         puzzleString.slice(Math.floor(i / 3) * 27 + (i % 3) * 3 + 18, 
                                             Math.floor(i / 3) * 27 + (i % 3) * 3 + 21);

          // Validate each row, column, and region for duplicates
          const rowSet = new Set(row.replace(/\./g, '')); // Remove empty cells
          const colSet = new Set(col.replace(/\./g, ''));
          const regionSet = new Set(region.replace(/\./g, ''));
 
        if (rowSet.size < row.replace(/\./g, '').length) {
              // return { error: 'Invalid puzzle: duplicates in row' };
              return { error: 'Puzzle cannot be solved' };
          }
          if (colSet.size < col.replace(/\./g, '').length) {
              // return { error: 'Invalid puzzle: duplicates in column' };
              return { error: 'Puzzle cannot be solved' };
          }
          if (regionSet.size < region.replace(/\./g, '').length) {
              // return { error: 'Invalid puzzle: duplicates in region' };
              return { error: 'Puzzle cannot be solved' };
          }
      }

      return { valid: true };
  }


  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowValues = puzzleString.slice(rowStart, rowStart + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colValues = [];
    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleString[column + i * 9]);
    }
    return !colValues.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;

    const regionValues = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        regionValues.push(puzzleString[(regionRowStart + r) * 9 + (regionColStart + c)]);
      }
    }
    return !regionValues.includes(value);
  }

  solve(puzzleString) {
    // Validate the puzzle string
    const validation = this.validate(puzzleString);
    if (validation.error) {
      // return { error: validation.error }; // Return early if invalid
      return validation;
    }

    const puzzleArray = puzzleString.split('');

    const findEmptyPosition = (puzzleArray) => puzzleArray.indexOf('.');

    const isValidPlacement = (puzzleArray, row, col, value) => {
      return this.checkRowPlacement(puzzleArray.join(''), row, col, value) &&
             this.checkColPlacement(puzzleArray.join(''), row, col, value) &&
             this.checkRegionPlacement(puzzleArray.join(''), row, col, value);
    };

    const solveRecursive = (puzzleArray) => {
      const emptyPosition = findEmptyPosition(puzzleArray);
      if (emptyPosition === -1) {
        return puzzleArray.join(''); // Return the solved puzzle
      }

      const row = Math.floor(emptyPosition / 9);
      const col = emptyPosition % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        if (isValidPlacement(puzzleArray, row, col, value)) {
          puzzleArray[emptyPosition] = value;

          const solution = solveRecursive(puzzleArray);
          if (solution) {
            return solution; // Valid solution found
          }

          puzzleArray[emptyPosition] = '.'; // backtrack
        }
      }

      return null; // No solution found
    };

    const solvedPuzzle = solveRecursive(puzzleArray);
    if (solvedPuzzle) {
      return { solution: solvedPuzzle }; // Return the solution if found
    } else {
      return { error: 'Puzzle cannot be solved' }; // No valid solution found
    }
  }


  checkPlacement(puzzleString, row, column, value) {
    const validations = {
      row: this.checkRowPlacement(puzzleString, row, column, value),
      column: this.checkColPlacement(puzzleString, row, column, value),
      region: this.checkRegionPlacement(puzzleString, row, column, value),
    };

    // If any validation fails, return false
    return Object.values(validations).every(isValid => isValid);
  }
}

module.exports = SudokuSolver;
