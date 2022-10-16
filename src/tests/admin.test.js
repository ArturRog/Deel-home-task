const app = require('../app');
const request = require("supertest");
const {seedData} = require("../../scripts/seedData");

describe("Test admin endpoints", () => {
    beforeAll(async () => {
        await seedData()
    });

    describe("Retrieve best professions", () => {
        const url = '/admin/best-profession';
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode } = await request(app).get(url);
            expect(statusCode).toEqual(401);
        });

        it('should return best profession within time range', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .query({
                    start: '2020-08-14',
                    end: '2020-08-16',
                })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatch('Programmer');
        });

        it('should return null if no profession meeting the conditions has been found within the time range', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .query({
                    start: '2020-08-29',
                    end: '2020-08-30',
                })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toEqual(null);
        });
    })

    describe("Retrieve best clients", () => {
        const url = '/admin/best-clients';
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode } = await request(app).get(url);
            expect(statusCode).toEqual(401);
        });

        it('should return best clients within time range', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .query({
                    start: '2020-08-10',
                    end: '2020-08-16',
                })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([
                {"fullName": "Ash Kethcum", "id": 4, "paid": 2020},
                {"fullName": "Mr Robot", "id": 2, "paid": 242}
            ])
        });

        it('should respect limit query param', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .query({
                    start: '2020-08-10',
                    end: '2020-08-16',
                    limit: 1
                })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([{
                "fullName": "Ash Kethcum", "id": 4, "paid": 2020}
            ])
        });

        it('should return empty list if no best clients were found', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .query({
                    start: '2021-08-10T09:00:00.000Z',
                    end: '2021-08-12T09:00:00.000Z'
                })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([])
        });
    })
})