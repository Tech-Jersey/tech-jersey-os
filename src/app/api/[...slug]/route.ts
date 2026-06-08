import { REST_GET, REST_POST, REST_DELETE, REST_PATCH, REST_OPTIONS } from '@payloadcms/next/routes'
import configPromise from '@payload-config'

export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const OPTIONS = REST_OPTIONS(configPromise)
