const redis = require('redis')
const Bluebird = require('bluebird')

Bluebird.promisifyAll([redis.RedisClient, redis.Multi])

module.exports = redis
