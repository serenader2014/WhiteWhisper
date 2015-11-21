module.exports = function () {
    return function assets (req, res, next) {
        next();
    };
};