const { createUrl } = require("../service/url");
const { findOne, create } = require("../crud/shortUrl");
const { disconnectRedis } = require("../config/redis_config");

jest.mock("../crud/shortUrl");

describe("creating a short-url", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(async () => {
		await disconnectRedis();
	});

	it("created url successfully", async () => {
		findOne.mockResolvedValue(null);

		const newShortUrl = {
			id: 1,
			originalUrl: "example.com/link/deeplink",
			alias: "short",
		};
		create.mockResolvedValue(newShortUrl);

		let req = {
			body: {
				longUrl: "example/link/deeplink/deeperlink",
				customAlias: "short",
			},
		};

		const response = await createUrl(req);

		expect(response).toBe("http://localhost:3000/short");
	});

	it("longUrl already exists", async () => {
		const existingShortUrl = {
			dataValues: {
				id: 1,
				originalUrl: "example.com/link/deeplink",
				alias: "short",
			},
		};
		findOne.mockResolvedValue(existingShortUrl);

		let req = {
			body: {
				longUrl: "example/link/deeplink/deeperlink",
				customAlias: "short",
			},
		};

		const response = await createUrl(req);

		expect(response).toBe("http://localhost:3000/short");
		expect(create).not.toHaveBeenCalled();
	});
});
