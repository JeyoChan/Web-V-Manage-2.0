const Redis = require('ioredis');

const { RedisConfig } = require('../../config.json');

const RedisNewConfig = {
  keyPrefix: RedisConfig.keyPrefix,
  host: RedisConfig.RedisHost,
  port: RedisConfig.RedisPort,
  password: RedisConfig.Password,
  db: RedisConfig.DB,
  family: 4,
}

function RedisNew() {
  return new Redis(RedisNewConfig);
}

const redis = RedisNew();
redis.config('SET', 'notify-keyspace-events', 'Kh$').then(() => redis.disconnect());

module.exports = {
  RedisNew,
};
