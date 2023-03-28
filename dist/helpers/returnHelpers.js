"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuccess = exports.handleError = void 0;
const handleError = (error) => {
    return {
        success: false,
        message: error.message,
        data: null,
        tokens: null,
        stack: error.stack,
    };
};
exports.handleError = handleError;
const handleSuccess = (message = 'success', data = {}, tokens = null) => {
    return {
        success: true,
        message,
        data,
        tokens,
        stack: null,
    };
};
exports.handleSuccess = handleSuccess;
//# sourceMappingURL=returnHelpers.js.map