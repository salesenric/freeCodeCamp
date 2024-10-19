'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    const validation = solver.validate(puzzle);
    if (validation.error) {
      return res.json(validation);
    }

    // Validate coordinate format
    const coordinateRegex = /^[A-I][1-9]$/;
    if (!coordinateRegex.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; // A-I => 0-8
    const col = parseInt(coordinate[1], 10) - 1; // 1-9 => 0-8

    if (row < 0 || row > 8 || col < 0 || col > 8) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Validate value
    if (typeof value !== 'string' || !/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    // Check if the value is already placed at the specified coordinate
    if (puzzle[row * 9 + col] === value) {
      return res.json({ valid: true });
    }

    const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
    const colValid = solver.checkColPlacement(puzzle, row, col, value);
    const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);

    if (rowValid && colValid && regionValid) {
      return res.json({ valid: true });
    } else {
      const conflict = [];
      if (!rowValid) conflict.push('row');
      if (!colValid) conflict.push('column');
      if (!regionValid) conflict.push('region');
      return res.json({ valid: false, conflict });
    }
  });



  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
        return res.json(validation);
      }

      const solved = solver.solve(puzzle);
      res.json(solved);
    });
};