const redis = require('./redis')

module.exports = (redisOptions, ...namespaces) => {
	const redisClient = redis.createClient(redisOptions)

	function getSessionNamespace(sessionID) {
		return [...namespaces, sessionID].filter((v) => v !== null && v !== undefined).join(':')
	}

	return {
		async set(sessionID, payload, seconds) {
			const args = (seconds && seconds > 0) ? ['EX', seconds] : []
			await redisClient.setAsync(getSessionNamespace(sessionID), JSON.stringify(payload), ...args)
		},

		async get(sessionID) {
			return JSON.parse(await redisClient.getAsync(getSessionNamespace(sessionID)))
		},

		async remove(sessionID) {
			await redisClient.delAsync(getSessionNamespace(sessionID))
		},

		async refresh(sessionID, seconds) {
			await redisClient.expireAsync(getSessionNamespace(sessionID), seconds)
		},
	}
}
