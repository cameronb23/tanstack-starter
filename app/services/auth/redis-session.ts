// import { createClient } from 'redis';
// import type { SecondaryStorage } from 'better-auth';

// const redis = createClient();

// const redisSecondaryStorage: SecondaryStorage = {
//   get: async (key) => await redis.get(key),
//   set: async (key, value, ttl) => {
//     if (ttl) await redis.set(key, value, { EX: ttl });
//     else await redis.set(key, value);
//   },
//   delete: async (key) => await redis.del(key),
// };

// export default redisSecondaryStorage;
