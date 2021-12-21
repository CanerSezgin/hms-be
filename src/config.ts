import * as dotenv from 'dotenv'

dotenv.config()

const mainConfig = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoDB: {
    uri: process.env.MONGODB_URI!
  },
  jwt: {
    secret: process.env.JWT_KEY!
  }
}

export const config = {
  ...mainConfig,
  meta: {
    isDev: mainConfig.env === 'development',
    isProd: mainConfig.env === 'production',
  },
}

export const checkEnvVars = (envVarsMustList: string[] = []) => {
  envVarsMustList.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`Env Vars Missing | ${envVar}`)
    }
  })
}
