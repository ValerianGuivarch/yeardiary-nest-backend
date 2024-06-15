import { AppModule } from './app.module'
import config from './config/configuration'
import { MigrationsProvider } from './data/database/migrations/MigrationsProvider'
import fastifyCookie from '@fastify/cookie'
import fastifyPassport from '@fastify/passport'
import fastifySession from '@fastify/session'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: ['error', 'warn', 'log']
  })
  const migrationRunner = app.get(MigrationsProvider)
  try {
    await migrationRunner.runMigrations()
    console.log('Migrations completed successfully.')
  } catch (error) {
    console.error('Migrations failed:', error)
  }
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidUnknownValues: true }))

  await app.register(fastifyCookie)
  await app.register(fastifySession, {
    secret: 'your-secret-has-to-be-changed-with-a-real-one', // Remplacez par un secret réel
    cookie: { secure: false } // Mettez à true si vous êtes en HTTPS
  })
  await app.register(fastifyPassport.initialize())
  await app.register(fastifyPassport.secureSession())

  const configuration = new DocumentBuilder()
    .setTitle('Starter swagger')
    .setDescription('The Starter API swagger')
    .setVersion('1.0')
    .addTag('Starter')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, configuration)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    }
  })

  /*const agent = createAgent({
    authSecret: configService.get('FOREST_AUTH_SECRET'),
    envSecret: configService.get('FOREST_ENV_SECRET'),
    isProduction: configService.get('NODE_ENV') === 'production',
    typingsPath: './typings.ts',
    typingsMaxDepth: 5
  })
    // Create your SQL datasource
    .addDataSource(createSqlDataSource(configService.get('DB_URI')))
  await agent.mountOnNestJs(app).start()*/

  app.enableCors({
    origin: [config().cors.forestAdmin, config().cors.backoffice],
    credentials: true
  })

  await app.listen(config().http.port, config().http.host)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap().then(() => console.log('Application started'))
