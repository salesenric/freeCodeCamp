'use strict';

const axios = require('axios'); // Use axios to make HTTP requests for stock data
const crypto = require('crypto'); // For hashing IP addresses

module.exports = function (app) {

  // In-memory storage for likes (Replace this with a database in production)
  let ipLikes = {};

  // Function to hash the IP address
  function hashIP(ip) {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const symbols = Array.isArray(req.query.stock) ? req.query.stock : [req.query.stock];
      const like = req.query.like === 'true'; // Check if "like" is true

      // Get IP address and anonymize it (hash for this example)
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const hashedIP = hashIP(ip);

      // Initialize likes for the IP address if not already set
      ipLikes[hashedIP] = ipLikes[hashedIP] || {};

      // Function to fetch stock data for a single stock
      async function getStockData(symbol) {
        try {
          const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol.toLowerCase()}/quote`);
      
          // Check if the response contains the necessary data
          if (!response.data || typeof response.data.latestPrice !== 'number') {
            throw new Error(`No valid price data available for ${symbol}`);
          }
      
          const price = parseFloat(response.data.latestPrice);
      
          // Check if the IP has already liked this stock
          if (like && !ipLikes[hashedIP][symbol]) {
            ipLikes[hashedIP][symbol] = 1; // Set like for this stock
          }
      
          // Calculate total likes for the stock
          const likes = Object.values(ipLikes).reduce((total, stockLikes) => {
            return total + (stockLikes[symbol] || 0);
          }, 0);
      
          return {
            stock: symbol.toUpperCase(),
            price: price,
            likes: likes
          };
        } catch (error) {
          console.error(error);
          return { stock: symbol, error: `Could not retrieve data for ${symbol}` };
        }
      }

      // Fetch data for each symbol
      const stockDataArray = await Promise.all(symbols.map(getStockData));

      // Handle multiple stocks case
      if (symbols.length === 2) {
        const relLikes = stockDataArray[0].likes - stockDataArray[1].likes;
        stockDataArray[0].rel_likes = relLikes;
        stockDataArray[1].rel_likes = -relLikes;
        return res.json({ stockData: stockDataArray });
      }

      // Handle single stock case
      const stockData = stockDataArray[0];
      return res.json({ stockData: stockData });
    });
};
