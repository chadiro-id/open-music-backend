const client = require('../../infras/redis/client');

class CacheService {
  async set(key, value, expirationInSecond = 1800) {
    const result = await client.set(key, value, {
      EX: expirationInSecond,
    });
    console.log(`[Cache Service] set -> key: ${key}, val: ${value}, result: ${result}`);
    const exists = await client.exists(key);
    console.log(`[Cache Service] set -> key: ${key}, exists: ${exists}`);
  }

  async get(key) {
    const result = await client.get(key);
    console.log(`[Cache Service] get -> key: ${key}, result: ${result}`);
    return result;
  }

  async delete(key) {
    const exists = await client.exists(key);
    console.log(`[Cache Service] del -> key: ${key}, exists: ${exists}`);
    const result = await client.del(key);
    console.log(`[Cache Service] del -> key: ${key}, result: ${result}`);
  }
}

module.exports = CacheService;