const app = require('../app');
const {Profile} = require("../model");
const request = require("supertest");
const {seedData} = require("../../scripts/seedData");

describe("Test job endpoints", () => {
    beforeAll(async () => {
        await seedData()
    });

    describe("Retrieve unpaid jobs", () => {
        const url = '/jobs/unpaid';
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode, body } = await request(app).get(url);

            expect(statusCode).toEqual(401);
        });

        it('should return unpaid user jobs', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([{
                description: 'work',
                paid: false,
                price: 201,
                ContractId: 2,
            }]);
        });

        it('should not return paid jobs', async () => {
            const { statusCode, body } = await request(app)
                .get(url)
                .set('profile_id', '3');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([]);
        });
    })

    describe("Pay job", () => {
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode, body } = await request(app)
                .post('/jobs/123/pay');
            expect(statusCode).toEqual(401);
        });

        it('should respond with 404 when job is not found', async () => {
            const { statusCode, body } = await request(app)
                .post('/jobs/999/pay')
                .set('profile_id', '1');
            expect(statusCode).toEqual(404);
            expect(body).toMatchObject({
                error: {
                    message: 'Job not found'
                }
            });
        });

        it('should respond with 409 when job was already paid', async () => {
            const { statusCode, body } = await request(app)
                .post('/jobs/6/pay')
                .set('profile_id', '4');
            expect(statusCode).toEqual(409);
            expect(body).toMatchObject({
                error: {
                    message: 'Job was already paid'
                }
            });
        });

        it('should respond with 409 when job was already paid', async () => {
            const { statusCode, body } = await request(app)
                .post('/jobs/5/pay')
                .set('profile_id', '4');
            expect(statusCode).toEqual(400);
            expect(body).toMatchObject({
                error: {
                    message: 'Insufficient client\'s balance'
                }
            });
        });

        it('should successfully pay for a job', async () => {
            const { statusCode, body } = await request(app)
                .post('/jobs/2/pay')
                .set('profile_id', '1');
            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                description: 'work',
                paid: true,
                price: 201,
                ContractId: 2,
            });
            const [client, contractor] = await Promise.all([
                Profile.findByPk(1),
                Profile.findByPk(6),
            ]);

            expect(client.balance).toEqual(949)
            expect(contractor.balance).toEqual(1415)
        });
    })
})