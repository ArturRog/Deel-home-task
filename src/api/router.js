const { Router } = require('express');
const contractsRouter = require("./contracts/router");
const { getProfile } = require("../middleware/getProfile");

const router = new Router();

router.use(getProfile);
router.use('/contracts', contractsRouter);

module.exports = router;