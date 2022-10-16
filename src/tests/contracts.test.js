const app = require('../app');
const {sequelize, Profile, Contract, Job} = require("../model");
const request = require("supertest");
const {seedData} = require("../../scripts/seedData");

describe("Test contracts endpoints", () => {
    beforeAll(async () => {
        await seedData()
    });

    describe("Retrieve single contract", () => {
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts/1');

            expect(statusCode).toEqual(401);
        });

        it('should return contract when profile_id header matches with client', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts/1')
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject({
                id: 1,
                terms: 'bla bla bla',
                status: 'terminated',
                ClientId: 1,
                ContractorId: 5,
            });
        });

        it('should respond with 404 when contract does not exist', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts/999')
                .set('profile_id', '1');

            expect(statusCode).toEqual(404);
        });
    })

    describe("Retrieve all contracts", () => {
        it('should respond with 401 when profile_id header is missing', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts');
            expect(statusCode).toEqual(401);
        });

        it('should return all active user contracts', async () => {
            const { statusCode, body } = await request(app)
                .get('/contracts')
                .set('profile_id', '1');

            expect(statusCode).toEqual(200);
            expect(body).toMatchObject([{
                id:2,
                terms: 'bla bla bla',
                status: 'in_progress',
                ClientId: 1,
                ContractorId: 6
            }]);
        });
    })
})