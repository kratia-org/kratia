export const statusCodes = [
    { code: 200, message: "OK" },
    { code: 201, message: "Created" },
    { code: 202, message: "Accepted" },
    { code: 204, message: "No Content" },
    { code: 205, message: "Reset Content" },
    { code: 206, message: "Partial Content" },
    { code: 207, message: "Multi-Status" },
    { code: 208, message: "Already Reported" },
    { code: 226, message: "IM Used" },
    { code: 301, message: "Moved Permanently" },
    { code: 302, message: "Found" },
    { code: 303, message: "See Other" },
    { code: 304, message: "Not Modified" },
    { code: 305, message: "Use Proxy" },
    { code: 307, message: "Temporary Redirect" },
    { code: 308, message: "Permanent Redirect" },
    { code: 400, message: "Bad Request" },
    { code: 401, message: "Unauthorized" },
    { code: 403, message: "Forbidden" },
    { code: 404, message: "Not Found" },
    { code: 405, message: "Method Not Allowed" },
    { code: 406, message: "Not Acceptable" },
    { code: 407, message: "Proxy Authentication Required" },
    { code: 408, message: "Request Timeout" },
    { code: 409, message: "Conflict" },
    { code: 410, message: "Gone" },
    { code: 411, message: "Length Required" },
    { code: 412, message: "Precondition Failed" },
    { code: 413, message: "Payload Too Large" },
    { code: 414, message: "URI Too Long" },
    { code: 415, message: "Unsupported Media Type" },
    { code: 416, message: "Range Not Satisfiable" },
    { code: 417, message: "Expectation Failed" },
    { code: 418, message: "I'm a teapot" },
    { code: 421, message: "Misdirected Request" },
    { code: 422, message: "Unprocessable Entity" },
    { code: 423, message: "Locked" },
    { code: 424, message: "Failed Dependency" },
    { code: 425, message: "Too Early" },
    { code: 426, message: "Upgrade Required" },
    { code: 428, message: "Precondition Required" },
    { code: 429, message: "Too Many Requests" },
    { code: 431, message: "Request Header Fields Too Large" },
    { code: 451, message: "Unavailable For Legal Reasons" },
    { code: 500, message: "Internal Server Error" },
    { code: 502, message: "Bad Gateway" },
    { code: 503, message: "Service Unavailable" },
    { code: 504, message: "Gateway Timeout" },
    { code: 505, message: "HTTP Version Not Supported" },
    { code: 506, message: "Variant Also Negotiates" },
    { code: 507, message: "Insufficient Storage" },
    { code: 508, message: "Loop Detected" },
    { code: 510, message: "Not Extended" },
    { code: 511, message: "Network Authentication Required" },
    { code: 598, message: "Network read timeout error" },
    { code: 599, message: "Network connect timeout error" },
]

export class ServerError extends Error {
    status: number;
    error?: string;
    details?: any;
    constructor(status: number, error?: string, message?: string, details?: any) {
        const statusCode = statusCodes.find((s) => s.code === status);
        super(message ? message : statusCode?.message);
        this.status = status;
        this.error = error;
        this.details = details;
    }
}

export const error = (status: number, error?: string, message?: string, details?: any) => {
    throw new ServerError(status, error, message, details);
};

export const valError = (issues: any) => {
    let errors = []
    for (const issue of issues) {
        errors.push({
            path: issue.path[0].key,
            input: issue.input,
            expected: issue.expected,
            message: issue.message
        })
    }
    return errors
}