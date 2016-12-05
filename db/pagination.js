export default class Pagination {
    constructor(model) {
        this.model = model.forge();
    }

    list({
        page = 1,
        pageSize = 10,
        order = '-id',
        queryBuilder = function qb() {},
    }, currentUser, options = {}) {
        return (async () => {
            const collection = await this.model.query(qb => {
                queryBuilder(qb);
            }).orderBy(order).fetchPage({ pageSize, page, ...options });

            return {
                list: collection.reduce((arr, item) => {
                    arr.push(item.structure(currentUser));
                    return arr;
                }, []),
                pagination: collection.pagination,
            };
        })();
    }
}
