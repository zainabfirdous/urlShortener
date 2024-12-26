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
			createdAt: "26-12-2024T19:45:00",
		};
		create.mockResolvedValue(newShortUrl);

		let req = {
			body: {
				longUrl: "example/link/deeplink/deeperlink",
				customAlias: "short",
			},
			userDetails: {
				uid: "string",
			},
		};

		const response = await createUrl(req);
		const ob = {
			createdAt: undefined,
			shortUrl: "http://localhost:3000/short",
		};
		expect(response).toStrictEqual(ob);
	});

	it("longUrl already exists", async () => {
		const existingShortUrl = {
			dataValues: {
				id: 1,
				originalUrl: "example.com/link/deeplink",
				alias: "short",
				createdAt: "26-12-2024T19:45:00",
			},
		};
		findOne.mockResolvedValue(existingShortUrl);

		let req = {
			body: {
				longUrl: "example/link/deeplink/deeperlink",
				customAlias: "short",
			},
			userDetails: {
				uid: "string",
			},
		};

		const response = await createUrl(req);
		const ob = {
			createdAt: undefined,
			shortUrl: "http://localhost:3000/short",
		};
		expect(response).toStrictEqual(ob);

		expect(create).not.toHaveBeenCalled();
	});
});
