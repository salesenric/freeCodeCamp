const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
  setup(() => {
    solver = new Solver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = '123456789' +
                        '456789123' +
                        '789123456' +
                        '234567891' +
                        '567891234' +
                        '891234567' +
                        '345678912' +
                        '678912345' +
                        '912345678';
    const result = solver.validate(validPuzzle);
    assert.deepEqual(result, { valid: true });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '123456789' +
                          '456789123' +
                          '789123456' +
                          '234567891' +
                          '567891234' +
                          '891234567' +
                          '345678912' +
                          '678912345' +
                          '9123a6783'; // Invalid character 'a'
    const result = solver.validate(invalidPuzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '12345678'; // 8 characters
    const result = solver.validate(shortPuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = '1.3456789' +
                   '456789123' +
                   '789123456' +
                   '234567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkRowPlacement(puzzle, 0, 0, '2');
    assert.isTrue(result);
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '123456789' +
                   '456789123' +
                   '789123456' +
                   '234567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkRowPlacement(puzzle, 0, 0, '1');
    assert.isFalse(result);
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '123456789' +
                   '456789123' +
                   '789123456' +
                   '.34567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkColPlacement(puzzle, 0, 0, '2');
    assert.isTrue(result);
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '123456789' +
                   '456789123' +
                   '789123456' +
                   '234567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkColPlacement(puzzle, 0, 0, '1');
    assert.isFalse(result);
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '123456789' +
                   '4.6789123' +
                   '789123456' +
                   '234567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkRegionPlacement(puzzle, 0, 0, '5');
    assert.isTrue(result);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '123456789' +
                   '456789123' +
                   '789123456' +
                   '234567891' +
                   '567891234' +
                   '891234567' +
                   '345678912' +
                   '678912345' +
                   '912345678';
    const result = solver.checkRegionPlacement(puzzle, 0, 0, '1');
    assert.isFalse(result);
  });

  test('Valid puzzle strings pass the solver', () => {
    const validPuzzle = '123456789' +
                        '456789123' +
                        '789123456' +
                        '234567891' +
                        '567891234' +
                        '891234567' +
                        '345678912' +
                        '678912345' +
                        '912345678';
    const result = solver.solve(validPuzzle);
    assert.deepEqual(result, { solution: validPuzzle });
  });

  test('Invalid puzzle strings fail the solver', () => {
    const invalidPuzzle = '1.3356789' +
                          '456789123' +
                          '789123456' +
                          '234567891' +
                          '567891234' +
                          '891234567' +
                          '345678912' +
                          '678912345' +
                          '912345678';
    const result = solver.solve(invalidPuzzle);
    assert.deepEqual(result, { error: 'Puzzle cannot be solved' });
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const incompletePuzzle = '123456789' +
                             '456789123' +
                             '789123456' +
                             '234567891' +
                             '567891234' +
                             '8912345..' + // Incomplete
                             '345678912' +
                             '678912345' +
                             '912345678';
    const result = solver.solve(incompletePuzzle);
    assert.isDefined(result.solution);
    assert.equal(result.solution.length, 81);
  });
});
