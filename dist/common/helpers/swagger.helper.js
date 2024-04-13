"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerHelper = void 0;
const pathMethods = ['get', 'post', 'put', 'patch', 'delete'];
const generalResponses = {
    404: { description: 'Not found' },
    422: { description: 'Unprocessable entity' },
    500: { description: 'Server error' },
};
const authResponses = {
    401: { description: 'Not authenticated' },
    403: { description: 'Access denied' },
};
const deleteResponses = {
    204: { description: 'No content' },
};
const mediaResponses = {
    415: { description: 'Unsupported Media Type' },
};
class SwaggerHelper {
    static setDefaultResponses(document) {
        for (const key of Object.keys(document.paths)) {
            for (const method of pathMethods) {
                const route = document.paths[key]?.[method];
                if (route) {
                    Object.assign(route.responses, generalResponses);
                    if (route.security) {
                        Object.assign(route.responses, authResponses);
                    }
                    if (method === 'delete') {
                        delete route.responses[200];
                        Object.assign(route.responses, deleteResponses);
                    }
                }
            }
        }
    }
}
exports.SwaggerHelper = SwaggerHelper;
//# sourceMappingURL=swagger.helper.js.map