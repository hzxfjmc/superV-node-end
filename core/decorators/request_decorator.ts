import 'reflect-metadata';
import { ReqMethod } from '../../model/enums/req_method';

const PATH_METADATA = 'path';
const METHOD_METADATA = 'method';

const defaultMetadata = {
    [PATH_METADATA]: '/',
    [METHOD_METADATA]: ReqMethod.GET,
};
interface IRequestMappingMetadata {
    path?: string;
    method?: ReqMethod;
}

export const RequestMapping = (
    metadata: IRequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
    const path = metadata[PATH_METADATA] || '/';
    const RequestMethod = metadata[METHOD_METADATA] || ReqMethod.GET;

    return (target, key, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
        Reflect.defineMetadata(METHOD_METADATA, RequestMethod, descriptor.value);
        return descriptor;
    };
};

/**
 * @description 请求方法
 * @param {ReqMethod} method
 */
const createMappingDecorator = (method: ReqMethod) => (
    path?: string,
): MethodDecorator => {
    return RequestMapping({
        [PATH_METADATA]: path,
        [METHOD_METADATA]: method,
    });
};

/**
 * Routes HTTP POST requests to the specified path.
 */
export const Post = createMappingDecorator(ReqMethod.POST);

/**
 * Routes HTTP GET requests to the specified path.
 */
export const Get = createMappingDecorator(ReqMethod.GET);

/**
 * Routes HTTP DELETE requests to the specified path.
 */
export const Delete = createMappingDecorator(ReqMethod.DELETE);

/**
 * Routes HTTP PUT requests to the specified path.
 */
export const Put = createMappingDecorator(ReqMethod.PUT);

/**
 * Routes HTTP PATCH requests to the specified path.
 */
export const Patch = createMappingDecorator(ReqMethod.PATCH);

/**
 * Routes HTTP OPTIONS requests to the specified path.
 */
export const Options = createMappingDecorator(ReqMethod.OPTIONS);

/**
 * Routes HTTP HEAD requests to the specified path.
 */
export const Head = createMappingDecorator(ReqMethod.HEAD);

/**
 * Routes all HTTP requests to the specified path.
 */
export const All = createMappingDecorator(ReqMethod.ALL);