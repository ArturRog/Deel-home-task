const { Op } = require("sequelize");
const {Contract, Job, Profile, sequelize} = require("../model");
const ClientFacingError = require("../middleware/clientFacingError");

const depositMoney = async (amountToDeposit, userId) => {
    return sequelize.transaction(async (transaction) => {
        const client = await Profile.findOne({
            where: {
                id: userId,
                type: 'client'
            }
        }, { transaction });

        if (!client) {
            throw new Error('Client not found')
        }

        const sumOfObligations = await Job.sum('price', {
            where: {
                [Op.not]: [{ paid: false }]
            },
            include: {
                model: Contract,
                required: true,
                where: {
                    status: 'in_progress',
                    ClientId: userId
                }
            }
        }, { transaction });

        if (amountToDeposit > sumOfObligations * 1.25) {
            throw new ClientFacingError('Cannot deposit more than 25% of your current obligations', 400)
        }

        //Round a number to 2 decimal places
        const newBalance = (client.balance + amountToDeposit).toFixed(2)
        //By converting to float we can get rid of .00
        client.balance = parseFloat(newBalance)
        await client.save({ transaction })
        return client;
    })
}

module.exports = {
    depositMoney: depositMoney,
}