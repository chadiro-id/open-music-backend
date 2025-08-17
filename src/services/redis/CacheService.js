const config = require('../../config');
const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    const result = await this._client.set(key, value, {
      EX: expirationInSecond,
    });
    console.log(`[Cache Service] set -> key: ${key}, val: ${value}, result: ${result}`);
    const exists = await this._client.exists(key);
    console.log(`[Cache Service] set -> key: ${key}, exists: ${exists}`);
  }

  async get(key) {
    const result = await this._client.get(key);
    console.log(`[Cache Service] get -> key: ${key}, result: ${result}`);
    return result;
  }

  async delete(key) {
    const exists = await this._client.exists(key);
    console.log(`[Cache Service] del -> key: ${key}, exists: ${exists}`);
    const result = await this._client.del(key);
    console.log(`[Cache Service] del -> key: ${key}, result: ${result}`);
  }
}

module.exports = CacheService;