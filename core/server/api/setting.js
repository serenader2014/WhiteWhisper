import Setting from '../model/setting';
import get     from '../helper/get-data';
import _       from 'lodash';

export default {
    get(...args) {
        return get.apply(Setting, args);
    },
    create(options) {
        const setting = new Setting();
        _.extend(setting, options);
        return setting.saveAsync().spread((currentSetting) => {
            const result = currentSetting;
            return result;
        });
    },
    update(id, options) {
        const obj = {};
        _.extend(obj, options);

        return Setting.findByIdAndUpdateAsync(id, obj);
    },
    delete(id) {
        return Setting.findByIdAndRemoveAsync(id);
    },
};
