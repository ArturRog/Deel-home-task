const app = require('../app');
const request = require("supertest");
const {seedData} = require("../../scripts/seedData");

describe.only("Test balances endpoints", () => {
    beforeEach(async () => {
        await seedData()
    });

    describe("Deposit money", () => {
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode, body } = await request(app)
                .get('/balances/deposit/1');
            expect(statusCode).toEqual(401);
        });

        it('should deposit money', async () => {
            const { statusCode, body } = await request(app)
                .post('/balances/deposit/1')
                .send({ amountToDeposit: 1 })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                id: 1,
                firstName: 'Harry',
                lastName: 'Potter',
                profession: 'Wizard',
                balance: 1151,
                type:'client'
            });
        });

        it('should round to 2 decimal places', async () => {
            const { statusCode, body } = await request(app)
                .post('/balances/deposit/1')
                .send({ amountToDeposit: 1.55555 })
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                id: 1,
                firstName: 'Harry',
                lastName: 'Potter',
                profession: 'Wizard',
                balance: 1151.56,
                type:'client'
            });
        });

        it('should not allow to deposit more than 25% of current obligations', async () => {
            const { statusCode, body } = await request(app)
                .post('/balances/deposit/1')
                .send({ amountToDeposit: 2000 })
                .set('profile_id', '1');

            expect(statusCode).toEqual(400);
            expect(body).toMatchObject({
                error: {
                    message: 'Cannot deposit more than 25% of your current obligations'
                }
            });
        });
    })
})