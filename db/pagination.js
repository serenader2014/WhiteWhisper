export default class Pagination {
    constructor(model) {
        this.model = model.forge();
    }

    list({
        page = 1,
        pageSize = 10,
        order = '-id',
        queryBuilder = function qb() {},
    }) {
        return (async () => {
            const collection = await this.model.query(qb => {
                queryBuilder(qb);
            }).orderBy(order).fetchPage({ pageSize, page });

            return {
                list: collection.toJSON(),
                pagination: collection.pagination,
            };
        })();
    }
}
