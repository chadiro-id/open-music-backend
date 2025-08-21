const config = require('../../config');
const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: config.redis.host,
  }
}).on('error', (err) => console.error('Redis client error:', err));

client.connect();

module.exports = client;