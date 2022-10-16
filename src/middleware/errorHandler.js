const ClientFacingError = require("./clientFacingError");
const ERROR_DEFAULTS = {
    status: 500,
    message: 'Internal server error'
};
const sendError = (res, status = ERROR_DEFAULTS.status, errorMessage = ERROR_DEFAULTS.message) => {
    res.status(status);
    res.json({
        error: {
            message: errorMessage
        }
    });
};
const defaultErrorHandler = (error, req, res, next) => {
    if (error instanceof ClientFacingError) {
        sendError(res, error.statusCode, error.message);
    }
    sendError(res);
}

module.exports = defaultErrorHandler