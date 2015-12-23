import _ from 'lodash';

export default function (conditions, amount, page) {
    let targetData;
    let tmpObj = {};
    let total  = 0;
    conditions = conditions || {};
    if ((+amount).toString() === 'NaN') {
        amount = 10;
    }
    if ((+page).toString() === 'NaN') {
        page = 1;
    }
    tmpObj = _.pick(conditions, (value) => {
        return value != null;
    });

    targetData = this.find(tmpObj);

    return targetData.countAsync().then((count) => {
        total = count;

        return targetData.sort({_id: -1}).skip((page - 1) * amount)
            .limit(amount).execAsync('find');
    }).then((data) => {
        return {
            total: +total,
            data: data,
            page: +page,
            amount: +amount
        };
    });
}