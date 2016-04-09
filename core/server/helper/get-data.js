import _ from 'lodash';

export default function (conditions = {}, amount = 10, page = 1) {
    let tmpObj = {};
    let total  = 0;
    let targetAmount = +amount;
    let targetPage = +page;
    if (targetAmount.toString() === 'NaN') {
        targetAmount = 10;
    }
    if ((targetPage).toString() === 'NaN') {
        targetPage = 1;
    }
    /* eslint-disable eqeqeq */
    tmpObj = _.pick(conditions, (value) => value != null);
    const targetData = this.find(tmpObj);
    return targetData.countAsync().then((count) => {
        total = count;

        return targetData.sort({ _id: -1 }).skip((targetPage - 1) * targetAmount)
            .limit(targetAmount).execAsync('find');
    }).then((data) => {
        const result = {
            data,
            total : +total,
            page  : +targetPage,
            amount: +targetAmount,
        };
        return result;
    });
}
