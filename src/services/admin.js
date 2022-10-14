const { Op } = require("sequelize");
const {Contract, Job, Profile, sequelize} = require("../model");

const getBestProfession = async (start, end) => {
    const bestProfiles = await Profile.findAll({
        where: {
            type: 'contractor'
        },
        include: [{
            model: Contract,
            as: 'Contractor',
            required: true,
            include: [{
                model: Job,
                required: true,
                paid: true,
                paymentDate: {
                    [Op.lte]: end,
                    [Op.gte]: start
                }
            }]
        }],
        subQuery: false,
        limit: 1,
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        group: ['profession']
    })

    return bestProfiles.length === 0 ? null : bestProfiles[0].profession;
}

const getBestClients = async (start, end, limit= 2) => {
    const queryResults = await Profile.findAll({
        attributes: ['firstName', 'lastName', 'id', [sequelize.fn('sum', sequelize.col('price')), 'paidTotal']],
        where: {
            type: 'client'
        },
        include: [{
            model: Contract,
            as: 'Client',
            required: true,
            include: [{
                model: Job,
                required: true,
                paid: true,
                paymentDate: {
                    [Op.lte]: end,
                    [Op.gte]: start
                }
            }]
        }],
        subQuery: false,
        limit,
        order: [[sequelize.fn('sum', sequelize.col('price')), 'DESC']],
        group: ['Profile.id']
    })

    return toBestClientsResponse(queryResults);
}

const toBestClientsResponse = (results) => {
    return results.map(r => ({
        id: r.id,
        paid: r.dataValues.paidTotal,
        fullName: `${r.firstName} ${r.lastName}`
    }))
}

module.exports = {
    getBestProfession: getBestProfession,
    getBestClients: getBestClients
}