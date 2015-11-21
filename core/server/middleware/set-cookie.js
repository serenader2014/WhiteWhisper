module.exports = function () {
    return function setCookie (req, res, next) {
        if (req.isAuthenticated()) {
            req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 30);
            req.session.cookie.maxAge = 1000 * 60 * 30;
        }
        next();
    };
};