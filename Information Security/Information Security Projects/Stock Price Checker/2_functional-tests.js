const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  // Test 1: Viewing one stock
  test('Viewing one stock: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        done();
      });
  });

  // Test 2: Viewing one stock and liking it
  test('Viewing one stock and liking it: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.isNumber(res.body.stockData.likes); // Ensure likes is a number
        done();
      });
  });

  // Test 3: Viewing the same stock and liking it again (should only be one like per IP)
  // Test 3: Viewing the same stock and liking it again (should only be one like per IP)
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.likes, 1); // Ensure the like count is 1
        chai.request(server)
          .get('/api/stock-prices?stock=AAPL&like=true')
          .end(function(err, res) {
            assert.equal(res.status, 200); // Should return 200 since the like does not increase
            assert.property(res.body, 'stockData');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.likes, 1); // Ensure likes count stays the same
            done();
          });
      });
  });


  // Test 4: Viewing two stocks
  test('Viewing two stocks: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&stock=GOOG')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2); // Ensure two stock data objects
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[1], 'stock');
        done();
      });
  });

  // Test 5: Viewing two stocks and liking them
  test('Viewing two stocks and liking them: GET request to /api/stock-prices', function(done) {
    chai.request(server)
      .get('/api/stock-prices?stock=AAPL&stock=GOOG&like=true')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2); // Ensure two stock data objects
        assert.property(res.body.stockData[0], 'likes');
        assert.property(res.body.stockData[1], 'likes');
        assert.isNumber(res.body.stockData[0].likes);
        assert.isNumber(res.body.stockData[1].likes);
        done();
      });
  });

});

