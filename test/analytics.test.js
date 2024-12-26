const {
	overallAnalysis,
	topicAnalytics,
	aliasAnalytics,
} = require("../service/analytics");
const { findOne, findAll, url_count } = require("../crud/shortUrl");
const {
	count_analysis,
	clickByDates,
	osAnalysis,
	deviceAnalysis,
} = require("../crud/analytics");
const { disconnectRedis } = require("../config/redis_config");

jest.mock("../crud/analytics");
jest.mock("../crud/shortUrl");
describe("short-url analytics", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	afterAll(async () => {
		await disconnectRedis();
	});

	it("alias analytics", async () => {
		findOne.mockResolvedValue({
			dataValues: {
				shortId: 5,
				longUrl: "example.com/deep/deeper",
				alias: "alias",
			},
		});

		count_analysis.mockResolvedValue(1);
		clickByDates.mockResolvedValue([{ date: "25-12-2024", clciks: 1 }]);
		osAnalysis.mockResolvedValue([
			{ osName: "IOS", uniqueClicks: 1, uniqueUser: 1 },
		]);
		deviceAnalysis.mockResolvedValue([
			{ deviceType: "mobile", uniqueClicks: 1, uniqueUser: 1 },
		]);
		let req = {
			params: {
				alias: "alias",
			},
		};
		const response = await aliasAnalytics(req);
		const response_ob = {
			totalClicks: 1,
			uniqueClicks: 1,
			clicksByDate: [{ date: "25-12-2024", clciks: 1 }],
			osType: [{ osName: "IOS", uniqueClicks: 1, uniqueUser: 1 }],
			deviceType: [{ deviceType: "mobile", uniqueClicks: 1, uniqueUser: 1 }],
		};
		expect(response).toStrictEqual(response_ob);
	});

	it("topic analytics", async () => {
		findAll.mockResolvedValue([
			{
				dataValues: {
					shortId: 5,
					longUrl: "example.com/deep/deeper",
					alias: "alias",
				},
			},
		]);

		count_analysis.mockResolvedValue(1);
		clickByDates.mockResolvedValue([{ date: "25-12-2024", clciks: 1 }]);
		let req = {
			params: {
				topic: "topic",
			},
		};
		const response = await topicAnalytics(req);
		const response_ob = {
			totalClicks: 1,
			uniqueClicks: 1,
			clicksByDate: [{ date: "25-12-2024", clciks: 1 }],
			urls: [
				{
					shortUrl: "http://localhost:3000/alias",
					totalClicks: 1,
					uniqueUsers: 1,
				},
			],
		};
		expect(response).toStrictEqual(response_ob);
	});

	it("overall analytics", async () => {
		findOne.mockResolvedValue({
			dataValues: {
				shortId: 5,
				longUrl: "example.com/deep/deeper",
				alias: "alias",
			},
		});
		url_count.mockResolvedValue(1);
		count_analysis.mockResolvedValue(1);
		clickByDates.mockResolvedValue([{ date: "25-12-2024", clciks: 1 }]);
		osAnalysis.mockResolvedValue([
			{ osName: "IOS", uniqueClicks: 1, uniqueUser: 1 },
		]);
		deviceAnalysis.mockResolvedValue([
			{ deviceType: "mobile", uniqueClicks: 1, uniqueUser: 1 },
		]);
		let req = {
			userDetails: {
				uid: "string",
			},
		};
		const response = await overallAnalysis(req);
		const resp_object = {
			totalUrls: 1,
			totalClicks: 1,
			uniqueClicks: 1,
			clicksByDates: [
				{
					clciks: 1,
					date: "25-12-2024",
				},
			],
			osType: [{ osName: "IOS", uniqueClicks: 1, uniqueUser: 1 }],
			deviceType: [{ deviceType: "mobile", uniqueClicks: 1, uniqueUser: 1 }],
		};
		expect(response).toStrictEqual(resp_object);
	});
});
