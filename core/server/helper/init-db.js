import settingApi    from '../api/setting';
import categoryApi   from '../api/category';
import permissionApi from '../api/permission';
import log           from './log';

const initDB = () => {
    const promise = settingApi.get({}, 1, 1).then((data) => {
        if (!data.total) {
            log.info('Create default blog setting');
            return settingApi.create(config.defaultBlogConfig);
        }
        return null;
    }).then(() => {
        const createCategory = categoryApi.get({}, 1, 1).then((data) => {
            if (!data.total) {
                log.info('Create default category');
                return categoryApi.create(config.defaultCategory);
            }
            return null;
        });
        return createCategory;
    }).then(() => {
        const createPermission = permissionApi.get({}, 1, 1).then((data) => {
            if (!data.total) {
                log.info('Create default permission suit');
                return permissionApi.create(config.defaultPermission)
                    .then(() => permissionApi.create(config.guestPermission));
            }
            return null;
        });
        return createPermission;
    });
    return promise;
};

export default initDB;
