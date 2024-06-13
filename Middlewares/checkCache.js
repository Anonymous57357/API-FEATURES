const redis = require("redis");
// connect to Redis

const redisClient = redis.createClient();
redisClient.on("connect", () => {
  console.log("connected to Redis");
});

redisClient.on("errror", (err) => {
  console.error("Redis error", err);
});

const checkCache = (req, res, next) => {
  const { id } = req.params;
  redisClient.get(id, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};

module.exports = checkCache;
