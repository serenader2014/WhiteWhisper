module.exports = function () {
    return function notFound (req, res) {
        res.status(404).send('404 not found.');
    };
};