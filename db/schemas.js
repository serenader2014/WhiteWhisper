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
        id: {type: increments, nullable: false, primary: true},
        uuid: {type: str, maxlength: 36, nullable: false, validations: {isUUID: true}},
        key: {type: str, maxlength: 150, nullable: false, unique: true},
        value: {type: text, maxlength: 65535, nullable: true},
        created_at: {type: dateTime, nullable: false},
        created_by: {type: integer, nullable: false},
        updated_at: {type: dateTime, nullable: true},
        updated_by: {type: integer, nullable: true}
    }
};
