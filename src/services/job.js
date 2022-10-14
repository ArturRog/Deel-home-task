const { Op } = require("sequelize");
const {Job, Contract, sequelize, Profile} = require("../model");

const getUnpaidUserJobs = async (userId) => {
    return Job.findAll({
        where: {
            paid: false,
        },
        include: {
            model: Contract,
            required: true,
            where: {
                status: 'in_progress',
                [Op.or]: [
                    {ContractorId: userId},
                    {ClientId: userId}
                ]
            }
        }
    })
}

//Pay for a job, a client can only pay if his balance >= the amount to pay.
// The amount should be moved from the client's balance to the contractor balance.
const payJob = async (jobId, clientId) => {
    return sequelize.transaction(async (transaction) => {
        const job = await Job.findOne({
            lock: true,
            where: { id: jobId },
            include: {
                model: Contract,
                required: true,
                where: { ClientId: clientId }
            },
        }, { transaction })

        if (!job) {
            throw new Error('Job not found');
        }
        if (job.paid) {
            throw new Error('Job was already paid');
        }

        const [client, contractor] = await Promise.all([
            Profile.findByPk(clientId, { lock: true, transaction }),
            Profile.findByPk(job.Contract.ContractorId, { lock: true, transaction }),
        ])

        const amountToPay = job.price;
        if (client.balance < amountToPay) {
            throw new Error('Insufficient client\'s balance');
        }

        client.balance -= amountToPay;
        contractor.balance += amountToPay;
        job.paid = true;
        job.paymentDate = new Date()

        await Promise.all([
            client.save(),
            contractor.save(),
            job.save()
        ])

        return job;
    });
}

module.exports = {
    getUnpaidUserJobs: getUnpaidUserJobs,
    payJob: payJob
}