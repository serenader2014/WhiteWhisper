import Promise  from 'bluebird';
import mongoose from 'mongoose';
const mongo         = Promise.promisifyAll(mongoose);
const Schema        = mongo.Schema;
const SettingSchema = new Schema({
    blogName             : String,
    blogDescription      : String,
    blogLogo             : String,
    blogFavicon          : String,
    register             : Boolean,
    theme                : String,
    requestAmount        : Number,
    update               : Date,
    background           : String,
    hasInitialized       : Boolean,
    defaultUserPermission: String,
    language             : String,
});

export default mongo.model('Setting', SettingSchema);
