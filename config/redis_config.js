const Redis = require("ioredis");

/*my redis server is running on default settings, ie., local host, 6379 port,
incase your redis server has different config please alter accordingly*/
const redis = new Redis();

const disconnectRedis = async () => {
	try {
		await redis.disconnect();
	} catch (err) {
		console.log(err);
	}
};

module.exports = { redis, disconnectRedis };
