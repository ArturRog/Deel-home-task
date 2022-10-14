const { Op } = require("sequelize");
const {Contract} = require("../model");

const getUserContractById = async (contractId, userId) => {
    return Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [
                {ContractorId: userId},
                {ClientId: userId}
            ]
        },
    })
}

const getAllUserContracts = async (userId) => {
    return await Contract.findAll({
        where: {
            [Op.not]: [
                { status: 'terminated' }
            ],
            [Op.or]: [
                {ContractorId: userId},
                {ClientId: userId}
            ]
        },
    })
}

module.exports = {
    getAllUserContracts: getAllUserContracts,
    getUserContractById: getUserContractById
}