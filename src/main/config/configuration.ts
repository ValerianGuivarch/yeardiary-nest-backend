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
  sqlite: {
    database: 'database.sqlite',
    autoLoadEntities: true,
  },
  cors: {
    frontend: env.FRONTEND_URL || 'http://127.0.0.1:3000'
  },
})
