const AUTH_METADATA = 'PERMISSION_METADATA';
export function permission(value) {
    return (target, key, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(AUTH_METADATA, value, descriptor.value);
        return descriptor;
    };
}
