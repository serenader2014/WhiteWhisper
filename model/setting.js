import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const SettingSchema = new Schema({
    blogName: String,
    blogDescription: String,
    blogLogo: String,
    blogFavicon: String,
    allowRegister: Boolean,
    theme: String,
    pageSize: Number,
    updatedAt: Date,
    updatedBy: {
        username: String,
        id: Schema.Types.ObjectId,
        image: String,
    },
    background: String,
    hasInitialized: Boolean,
    defaultPermission: String,
    language: String,
    plugins: Array,
});

export default mongoose.model('Setting', SettingSchema);
