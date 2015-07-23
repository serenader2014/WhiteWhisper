var login = function (req, res, next) {
    res.send('login');
    console.log(req.brute);
};

module.exports.login = login;