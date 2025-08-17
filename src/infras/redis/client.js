const config = require('../../config');
const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: config.redis.host,
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function connectRedis() {
  await client.connect();
  console.log('Redis client connected');
}

connectRedis();

module.exports = client;