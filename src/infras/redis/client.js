const config = require('../../config');
const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: config.redis.host,
  }
});

client.on('error', (err) => {
  console.error('Redis client error:', err);
});

const pool = client.createPool();

pool.on('error', (err) => {
  console.error('Redis client pool error:', err);
});

client.connect();

module.exports = {
  client,
  pool,
};