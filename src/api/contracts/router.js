const { Router } = require('express');
const asyncHandler = require('express-async-handler')
const {getAllUserContracts, getUserContractById} = require("../../services/contract");
const ClientFacingError = require("../../middleware/clientFacingError");

const contractsRouter = new Router();

contractsRouter.get('/', asyncHandler(async (req, res) => {
    const contracts = await getAllUserContracts(req.profile.id);
    res.json(contracts)
}))

contractsRouter.get('/:id', asyncHandler(async (req, res) =>{
    const {id} = req.params
    const contract = await getUserContractById(id, req.profile.id);
    if(!contract) {
        throw new ClientFacingError('Contract not found', 404);
    }
    res.json(contract)
}))

module.exports = contractsRouter;