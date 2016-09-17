import postApi from '../api/post';

export function list(req, res) {
    (async () => {
        try {
            const posts = await postApi.list();
            res.json(posts);
        } catch (e) {
            res.json(e);
        }
    })();
}

export function create(req, res) {

}
