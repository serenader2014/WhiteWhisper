import settingApi    from '../api/setting';
import categoryApi   from '../api/category';
import permissionApi from '../api/permission';
import log           from './log';

export default () => settingApi.get({}, 1, 1).then(data => {
    let promise = Promise.resolve();
    if (!data.total) {
        log.info('Create default blog setting');
        promise = settingApi.create(config.defaultBlogConfig);
    }
    return promise;
}).then(() => categoryApi.get({}, 1, 1).then(data => {
    let promise = Promise.resolve();
    if (!data.total) {
        log.info('Create default category');
        promise = categoryApi.create(config.defaultCategory);
    }
    return promise;
})).then(() => permissionApi.get({}, 1, 1).then(data => {
    let promise = Promise.resolve();
    if (!data.total) {
        log.info('Create default permission suit');
        promise = permissionApi.create(config.defaultPermission)
            .then(() => permissionApi.create(config.guestPermission));
    }
    return promise;
}));
