const createUrl = require("../../service/analytics")

jest.mock("../../crud")

describe("redirects to shortUrl and records analytics", ()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    afterAll(async () => {
        // Close database connections, stop servers, etc.
        await myDatabase.close();
      });

    it("redirect to short-url", async()=>{
        shortUrl.findOne.mockResolvedValue({id:5, longUrl:"example.com/deep/deeper", shortUrl:"example.com/alias"})

        tracker.create.mockResolvedValue({shortId:2, timestamp:"2154635", ipAddress:"127.0.0.1", os:"linux", deviceType:"laptop"})
        const response = await callShortUrl(alias)
        const longUrl = "example.com/deep/deeper"
        expect(response.status).toBe(200);
        expect(header['location']).toBe(longUrl)
    });

    it("redirection fails", async()=>{
        shortUrl.findOne.mockResolvedValue({id:5, longUrl:"example.com/deep/deeper", shortUrl:"example.com/alias"})

        tracker.create.mockResolvedValue({shortId:2, timestamp:"2154635", ipAddress:"127.0.0.1", os:"linux", deviceType:"laptop"})
        const response = await callShortUrl(alias)
        const longUrl = "example.com/deep/deeper"
        expect(response.status).toBe(500);
        expect(header['location']).not.toBe(longUrl)
    })
})