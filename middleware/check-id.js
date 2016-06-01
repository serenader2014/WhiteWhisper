import mongoose  from 'mongoose';

export default function () {
    const checkId = (req, res, next) => {
        const id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            next();
        } else {
            res.json({ code: -3, msg: 'id 格式错误。' });
        }
    };
    return checkId;
}
