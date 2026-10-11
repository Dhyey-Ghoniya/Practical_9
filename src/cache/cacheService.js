const NodeCache = require('node-cache');

// Standard TTL of 60 seconds, check period of 120 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

let hits = 0;
let misses = 0;

module.exports = {
  cache,
  get(key) {
    const data = cache.get(key);
    if (data !== undefined) {
      hits++;
      return { data, status: 'HIT' };
    }
    misses++;
    return { data: null, status: 'MISS' };
  },
  set(key, val, ttl = 60) {
    return cache.set(key, val, ttl);
  },
  del(key) {
    return cache.del(key);
  },
  getStats() {
    return {
      hits,
      misses,
      keysCount: cache.keys().length,
      keys: cache.keys(),
      nodeCacheStats: cache.getStats()
    };
  }
};