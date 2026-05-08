import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

dotenv.config()

/**
 * Interface to extend Response object with custom methods
 */
interface CustomResponse extends Response {
  default: (
    status: number,
    message: string | string[],
    content?: any,
    version?: boolean,
    endpoint?: boolean,
  ) => Response
  success: (message?: string, content?: any) => Response
  created: (message?: string, content?: any) => Response
  accepted: (message?: string, content?: any) => Response
  noContent: (message?: string, content?: any) => Response
  badRequest: (message?: string, content?: any) => Response
  unauthorized: (message?: string, content?: any) => Response
  forbidden: (message?: string, content?: any) => Response
  notFound: (message?: string, content?: any) => Response
  methodNotAllowed: (message?: string, content?: any) => Response
  error: (message?: string, content?: any) => Response
}

/**
 * Interface for the standard response structure
 */
interface ApiResponse {
  status: number
  message: string | string[]
  content?: any
  contentLength?: number
  timestamp?: number
  version?: string
  endpoint?: string
}

interface ResponseMiddlewareOptions {
  includeTimestamp?: boolean
  includeVersion?: boolean
  includeEndpoint?: boolean
}

export type { ApiResponse, CustomResponse, ResponseMiddlewareOptions }

const defaultOptions: Required<ResponseMiddlewareOptions> = {
  includeVersion: true,
  includeEndpoint: true,
  includeTimestamp: true,
}

/**
 * Method to simplify the response model
 * status  {Integer}            Response status code
 * message {String, Array}      Response message
 * content {Array, Object}      Response content
 */

const attachResponseMethods = (
  req: Request,
  res: CustomResponse,
  next: NextFunction,
  options: ResponseMiddlewareOptions = defaultOptions,
): void => {
  const settings: Required<ResponseMiddlewareOptions> = { ...defaultOptions, ...options }

  /**
   * Standard response method
   * @param {number}          status          Response status code
   * @param {string|string[]} message         Response message
   * @param {any}             content         Response content
   * @param {boolean}         version         Include version in response
   * @param {boolean}         endpoint        Include endpoint in response
   * @returns {Response}
   */
  res.default = function (
    status: number,
    message: string | string[],
    content?: any,
    version?: boolean,
    endpoint?: boolean,
  ): Response {
    const result: ApiResponse = {} as ApiResponse

    result.status = status
    result.message = message

    if (status === 500) {
      console.log(content)
    } else if (!!content) {
      result.content = content
    }

    result.contentLength = !!content ? (Array.isArray(content) ? content.length : 1) : 0

    const shouldIncludeTimestamp = settings.includeTimestamp
    const shouldIncludeVersion = version || settings.includeVersion
    const shouldIncludeEndpoint = endpoint || settings.includeEndpoint

    if (shouldIncludeTimestamp) {
      result.timestamp = new Date().getTime()
    }

    if (shouldIncludeVersion) {
      result.version = process.env.npm_package_version
    }

    if (shouldIncludeEndpoint) {
      result.endpoint = req.originalUrl || req.baseUrl || req.url
    }

    return this.status(status).json(result)
  }

  res.success = function (message: string = "Success!", content?: any): Response {
    return this.default(200, message, content)
  }

  res.created = function (
    message: string = "Resource created successfully!",
    content?: any,
  ): Response {
    return this.default(201, message, content)
  }

  res.accepted = function (message: string = "Request accepted!", content?: any): Response {
    return this.default(202, message, content)
  }

  res.noContent = function (message: string = "No content!", content?: any): Response {
    return this.default(204, message, content)
  }

  res.badRequest = function (message: string = "Invalid request!", content?: any): Response {
    return this.default(400, message, content)
  }

  res.unauthorized = function (message: string = "Invalid credentials!", content?: any): Response {
    return this.default(401, message, content)
  }

  res.forbidden = function (message: string = "Forbidden!", content?: any): Response {
    return this.default(403, message, content)
  }

  res.notFound = function (message: string = "Resource not found!", content?: any): Response {
    return this.default(404, message, content)
  }

  res.methodNotAllowed = function (
    message: string = "Method not allowed!",
    content?: any,
  ): Response {
    return this.default(405, message, content)
  }

  res.error = function (message: string = "Internal error!", content?: any): Response {
    return this.default(500, message, content)
  }

  next()
}

export default function responseMiddleware(
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): void

export default function responseMiddleware(
  options: ResponseMiddlewareOptions,
): (req: Request, res: CustomResponse, next: NextFunction) => void

export default function responseMiddleware(
  reqOrOptions: Request | ResponseMiddlewareOptions,
  maybeRes?: CustomResponse,
  maybeNext?: NextFunction,
): void | ((req: Request, res: CustomResponse, next: NextFunction) => void) {
  const isDirectMiddlewareUsage =
    typeof maybeNext === "function" &&
    !!maybeRes &&
    typeof (reqOrOptions as Request).method === "string"

  if (isDirectMiddlewareUsage) {
    return attachResponseMethods(
      reqOrOptions as Request,
      maybeRes as CustomResponse,
      maybeNext as NextFunction,
    )
  }

  const options = reqOrOptions as ResponseMiddlewareOptions

  return (req: Request, res: CustomResponse, next: NextFunction): void => {
    attachResponseMethods(req, res, next, options)
  }
}
