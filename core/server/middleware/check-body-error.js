export default function (req, res) {
    const errors = req.validationErrors();
    if (errors) {
        res.json({ code: -3, msg: '表单数据有误。', data: errors });
    }
    return !!errors;
}
