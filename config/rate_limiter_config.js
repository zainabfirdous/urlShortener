const { redis } = require("./redis_config");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
	storeClient: redis,
	points: 5,
	duration: 15 * 60,
	blockDuration: 60 * 5,
});

module.exports = { rateLimiter };
