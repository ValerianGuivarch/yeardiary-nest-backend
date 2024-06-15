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
  JwtService: {
    jwtSecret: requireEnv('JWT_SECRET'),
    jwtExpiration: parseInt(requireEnv('JWT_EXPIRATION'), 10),
    jwtRefreshExpiration: parseInt(requireEnv('JWT_REFRESH_EXPIRATION'), 10)
  },
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
  email: {
    enabled: env.EMAIL_ENABLED === 'true'
  },
  cors: {
    forestAdmin: env.CORS_FOREST_ADMIN || 'https://app.forestadmin.com',
    backoffice: env.CORS_NEREVA_BACKOFFICE || 'http://127.0.0.1:3000'
  },
  google: {
    clientId: requireEnv('GOOGLE_CLIENT_ID'),
    clientSecret: requireEnv('GOOGLE_CLIENT_SECRET')
  },
  mailjet: {
    emailFrom: requireEnv('MAILJET_EMAIL_FROM'),
    emailFromName: requireEnv('MAILJET_EMAIL_FROM_NAME'),
    apiKey: requireEnv('MAILJET_API_KEY'),
    apiKeySecret: requireEnv('MAILJET_API_SECRET')
  },
  cloudinary: {
    cloudName: requireEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: requireEnv('CLOUDINARY_API_KEY'),
    apiSecret: requireEnv('CLOUDINARY_API_SECRET')
  },
  sendgrid: {
    apiKey: requireEnv('SENDGRID_API_KEY'),
    senderMail: requireEnv('SENDGRID_SENDER_MAIL')
  },
  twilio: {
    accountSid: requireEnv('TWILIO_ACCOUNT_SID'),
    authToken: requireEnv('TWILIO_AUTH_TOKEN'),
    messagingService: requireEnv('TWILIO_MESSAGING_SERVICE')
  },
  prismic: {
    uri: requireEnv('PRISMIC_URI'),
    accessToken: requireEnv('PRISMIC_ACCESS_TOKEN')
  }
})
