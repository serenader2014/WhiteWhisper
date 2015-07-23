var mongoose      = Promise.promisifyAll(require('mongoose'));
var _             = require('lodash');
var Schema        = mongoose.Schema;
var get           = require('../helper/get-data');
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

SettingSchema.statics.get = function () {
    return get.apply(this, arguments);
};

SettingSchema.statics.create = function (options) {
    var setting = new this();
    _.extend(setting, options);
    return setting.saveAsync().spread(function (setting) {
        return setting;
    });
};

SettingSchema.statics.update = function (id, options) {
    var obj = {};
    _.extend(obj, options);

    return this.findByIdAndUpdateAsync(id, obj);
};

SettingSchema.statics.delete = function (id) {
    return this.findByIdAndRemoveAsync(id);
};

module.exports = mongoose.model('Setting', SettingSchema);