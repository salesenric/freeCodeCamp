const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite('POST /api/solve', function() {
    test('Solve a puzzle with valid puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16.X..926914.37.' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63..9..19' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '115..2.84..63..9..19...76...9..5..18.1..2.8.6.25...5...4.37..1..3.74...8..7..1..5' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', function() {
    test('Check a puzzle placement with all fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '1'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ['row']);
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A1',
          value: '1'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ['row', 'column']);
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'A2',
          value: '5'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          value: '5'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37x',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63..9..19',
          coordinate: 'A2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'Z2',
          value: '3'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'A2',
          value: '10'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
