const Redis = require("ioredis");

/*my redis server is running on my local host, 6379 port,
incase your redis server has different config please alter accordingly*/
const redis = new Redis({
	host: "localhost",
	port: 6379,
});

const disconnectRedis = async () => {
	try {
		await redis.disconnect();
	} catch (err) {
		console.log(err);
	}
};

module.exports = { redis, disconnectRedis };
