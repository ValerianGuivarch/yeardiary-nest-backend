/* eslint-disable no-process-env,no-magic-numbers */
import { env } from 'process'

function requireEnv(variable: string): string {
  const value = process.env[variable]
  if (value === undefined) {
    throw new Error(`Environment variable ${variable} is required but not defined.`)
  }
  return value
}

export default () => ({
  port: parseInt(requireEnv('PORT'), 10),
  http: {
    host: env.HOST || '0.0.0.0',
    port: parseInt(env.PORT || '3000', 10)
  },
  postgres: {
    host: env.DB_HOST || '127.0.0.1',
    port: env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432,
    username: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'postgres',
    database: env.DB_NAME || 'starter-database',
    autoLoadEntities: true,
    synchronize: true
  },
  cors: {
    forestAdmin: env.CORS_FOREST_ADMIN || 'https://app.forestadmin.com',
    backoffice: env.CORS_NEREVA_BACKOFFICE || 'http://127.0.0.1:3000'
  },
})
