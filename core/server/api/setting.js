import Setting from'../model/setting';
import get     from'../helper/get-data';
import _       from'lodash';

export default  {
    get () {
        return get.apply(Setting, arguments);
    },
    create (options) {
        var setting = new Setting();
        _.extend(setting, options);
        return setting.saveAsync().spread((setting) => {
            return setting;
        });
    },
    update (id, options) {
        var obj = {};
        _.extend(obj, options);

        return Setting.findByIdAndUpdateAsync(id, obj);
    },
    delete (id) {
        return Setting.findByIdAndRemoveAsync(id);
    }
};