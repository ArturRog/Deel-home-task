const { Router } = require('express');
const asyncHandler = require('express-async-handler')
const {getAllUserContracts, getUserContractById} = require("../../services/contract");

const contractsRouter = new Router();

contractsRouter.get('/', asyncHandler(async (req, res) => {
    const contracts = await getAllUserContracts(req.profile.id);
    res.json(contracts)
}))

contractsRouter.get('/:id', asyncHandler(async (req, res) =>{
    const {id} = req.params
    const contract = await getUserContractById(id, req.profile.id);
    if(!contract)
        return res.status(404).end()
    res.json(contract)
}))

module.exports = contractsRouter;