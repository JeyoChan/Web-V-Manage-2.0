

const { RedisConfig, RedisSecretConfig } = require('../config.json');
const { RedisNew } = require('../utils/DBUtils/redis');

class ContainerRunService {
  constructor(key) {
    this.key = key;
    this.redis = RedisNew();
  }

  async noContainerExist() {
    const numRes = await this.redis.pubsub('numsub', RedisConfig.DockerServiceSub);
    return numRes && (numRes[1] === 0);
  }

  async pushTaskIntoQueue(code) {
    await this.redis.set(this.key, code);
    await this.redis.rpush(RedisConfig.TaskQueue, this.key);
  }

  async getTaskResult() {
    return new Promise((resolve, reject) => {
      this.redis.subscribe(`__keyspace@0__:${RedisConfig.keyPrefix}${this.key}${RedisConfig.Responsesuffix}`);

      this.redis.on('message', async (channel, message) => {
        await this.redis.unsubscribe(`__keyspace@0__:${RedisConfig.keyPrefix}${this.key}${RedisConfig.Responsesuffix}`);
        const result = await this.redis.hgetall(this.key + RedisConfig.Responsesuffix);
        this.redis.del(this.key); // 设置过期时间，实现结果保留功能，拓展用户提交记录
        this.redis.del(this.key + RedisConfig.Responsesuffix);
        resolve(result);
      });
    });
  }
}

class ContainerService {
  constructor(inputKey) {
    this.inputKey = inputKey;
  }

  async getRegisterKey() {
    const redis = RedisNew();
    this.registerKey = await redis.get(RedisSecretConfig.RegisterKeyPath);
    if (this.registerKey === null) {
      await redis.set(RedisSecretConfig.RegisterKeyPath, RedisSecretConfig.RegisterDefaultKey);
      this.registerKey = RedisSecretConfig.RegisterDefaultKey;
    }
  }

  async register() {
    await this.getRegisterKey(); 
    if (this.registerKey !== this.inputKey) { return { suc: false, result: '注册码错误' }; }
    return { suc: true, result: RedisConfig };
  }

}


module.exports = {
  ContainerService,
  ContainerRunService,
};
