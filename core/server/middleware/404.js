export default function () {
    return (req, res) => {
        res.status(404).send('404 not found.');
    };
}