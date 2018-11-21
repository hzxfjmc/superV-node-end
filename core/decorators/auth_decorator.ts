const AUTH_METADATA = 'PERMISSION_METADATA';
const NEED_LOGIN = 'NEED_LOGIN';

export function permission(value) {
    return (target, key, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(AUTH_METADATA, value, descriptor.value);
        return descriptor;
    };
}
export function needLogin() {
    return (target, key, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(NEED_LOGIN, true, descriptor.value);
        return descriptor;
    };
}
