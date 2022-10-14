const { Router } = require('express');
const asyncHandler = require("express-async-handler");
const {getBestProfession, getBestClients} = require("../../services/admin");

const adminRouter = new Router();

adminRouter.get('/best-profession', asyncHandler(async (req, res) => {
    const { start, end } = req.query
    const profession = await getBestProfession(start, end);
    res.json(profession)
}))

adminRouter.get('/best-clients', asyncHandler(async (req, res) => {
    const { start, end, limit } = req.query
    const clients = await getBestClients(start, end, limit);

    res.json(clients)
}))

module.exports = adminRouter;