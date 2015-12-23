import settingApi    from '../api/setting';
import categoryApi   from '../api/category';
import permissionApi from '../api/permission';
import log           from './log';

let initDB = () => {
    return settingApi.get({}, 1, 1).then((data) => {
        if (!data.total) {
            log.info('Create default blog setting');
            return settingApi.create(config.defaultBlogConfig);
        }
    }).then(() => {
        return categoryApi.get({}, 1, 1).then((data) => {
            if (!data.total) {
                log.info('Create default category');
                return categoryApi.create(config.defaultCategory);
            }
        });
    }).then(() => {
        return permissionApi.get({}, 1, 1).then((data) => {
            if (!data.total) {
                log.info('Create default permission suit');
                return permissionApi.create(config.defaultPermission).then(() => {
                    return permissionApi.create(config.guestPermission);
                });
            }
        });
    });
};

export default initDB;