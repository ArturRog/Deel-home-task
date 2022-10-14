const { Router } = require('express');
const {depositMoney} = require("../../services/balance");
const asyncHandler = require("express-async-handler");

const balancesRouter = new Router();

balancesRouter.post('/deposit/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params
    const { amountToDeposit } = req.body;

    const user = await depositMoney(amountToDeposit, userId);

    res.json(user)
}))

module.exports = balancesRouter;