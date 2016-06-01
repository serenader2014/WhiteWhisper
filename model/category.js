import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const userObj = {
    username: String,
    id: Schema.Types.ObjectId,
    image: String,
};
const CategorySchema = new Schema({
    name: { type: String, unique: true },
    count: { type: Number, default: 0 },
    slug: { type: String, unique: true },
    image: String,
    createdAt: Date,
    createdBy: userObj,
    updatedAt: Date,
    updatedBy: userObj,
});

export default mongoose.model('Category', CategorySchema);
