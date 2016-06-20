const str = 'string';
const num = 'number';
const int = 'integer';
const text = 'text';
const float = 'float';
const increments = 'increments';
const bool = 'boolean';
const date = 'date';
const dateTime = 'dateTime';
const time = 'time';
const timestamp = 'timestamp';

export default {
    setting: {
        id: { type: increments, nullable: false, primary: true },
        uuid: { type: str, maxlength: 36, nullable: false, validations: { isUUID: true } },
        key: { type: str, maxlength: 150, nullable: false, unique: true },
        value: { type: text, maxlength: 65535, nullable: true },
        created_at: { type: dateTime, nullable: false },
        created_by: { type: int, nullable: false },
        updated_at: { type: dateTime, nullable: true },
        updated_by: { type: int, nullable: true },
    },
    post: {
        id: { type: increments, nullable: false, primary: true },
        title: { type: str, nullable: false },
        author: { type: int, nullable: false },
        slug: { type: str, nullable: false, unique: true },
        text: { type: text, nullable: true, fieldtype: 'medium' },
        html: { type: text, nullable: true, fieldtype: 'medium' },
        image: { type: text, nullable: true },
        status: { type: str, nullable: false, defaultTo: 'draft' }, // 'published', 'unpublished', 'deleted', 'draft'
        category: { type: int, nullable: false },
        url: { type: str, nullable: false, unique: true },
        createdAt: { type: dateTime, nullable: false },
        createdBy: { type: int, nullable: false },
        updatedAt: { type: dateTime, nullable: true },
        updatedBy: { type: int, nullable: true },
        publishedAt: { type: dateTime, nullable: true },
        publishedBy: { type: int, nullable: true },
        featured: { type: bool, nullable: false, defaultTo: false },
    },
    user: {
        id: { type: increments, nullable: false, primary: true },
        username: { type: str, maxlength: 150, nullable: false },
        slug: { type: str, maxlength: 150, nullable: false, unique: true },
        password: { type: str, maxlength: 60, nullable: false },
        email: { type: str, maxlength: 254, nullable: false, unique: true },
        image: { type: text, maxlength: 2000, nullable: true },
        cover: { type: text, maxlength: 2000, nullable: true },
        bio: { type: str, maxlength: 200, nullable: true },
        website: { type: text, maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true} },
        location: { type: text, maxlength: 65535, nullable: true },
        social_key: { type: str, maxlength: 150, nullable: true, unique: true },
        social_value: { type: text, maxlength: 65535, nullable: true },
        status: { type: str, maxlength: 150, nullable: false, defaultTo: 'active' },
        language: { type: str, maxlength: 6, nullable: false, defaultTo: 'en_US' },
        tour: { type: text, maxlength: 65535, nullable: true },
        last_login: { type: dateTime, nullable: true },
        created_at: { type: dateTime, nullable: false },
        created_by: { type: int, nullable: false },
        updated_at: { type: dateTime, nullable: true },
        updated_by: { type: int, nullable: true }
    },
    category: {
        name: { type: str, unique: true, nullable: false, maxlength: 150 },
        slug: { type: str, maxlength: 150, nullable: false, unique: true },
        image: { type: text, maxlength: 2000, nullable: true },
        created_at: { type: dateTime, nullable: false },
        created_by: { type: int, nullable: false },
        updated_at: { type: dateTime, nullable: true },
        updated_by: { type: int, nullable: false }
    }
};
