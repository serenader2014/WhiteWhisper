var _ = require('lodash');

module.exports = function (conditions, amount, page) {
    var targetData;
    var tmpObj = {};
    var total  = 0;
    conditions = conditions || {};
    amount     = amount || 1;
    page       = page || 1;

    tmpObj = _.pick(conditions, function (value) {
        return value != null;
    });

    targetData = this.find(tmpObj);

    return targetData.countAsync().then(function (count) {
        total = count;

        return targetData.sort({_id: -1}).skip((page - 1) * amount)
            .limit(amount).execAsync('find');
    }).then(function (data) {
        return {
            total: +total,
            data: data,
            page: +page,
            amount: +amount
        };
    });
};