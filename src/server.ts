import os from 'os'
import app from './app'
import { config, checkEnvVars } from './config'
import startMongoDB from './lib/mongoose'

checkEnvVars(['MONGODB_URI'])

const server = app.listen(config.port, async () => {
  console.log(
    `✓ SERVER: Listening at http://${os.hostname()}:${config.port} in ${
      config.env
    } environment.`
  )

  startMongoDB()
  .then(() => console.log('✓ MongoDB: successfully connected.'))
  .catch((err) => console.log('MongoDB Something went wrong', err))
})

server.timeout = 25000 // sets timeout to 25 seconds
