var mongoose      = Promise.promisifyAll(require('mongoose'));
var Schema        = mongoose.Schema;
var SettingSchema = new Schema({
    blogName       : String,
    blogDescription: String,
    blogLogo       : String,
    blogFavicon    : String,
    register       : Boolean,
    theme          : String,
    requestAmount  : Number,
    update         : Date,
    background     : String
});

module.exports = mongoose.model('Setting', SettingSchema);