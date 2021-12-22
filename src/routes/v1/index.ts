import { Router } from 'express'
import { config } from '../../config'

// Routes
import authRoute from './auth.route'
import testRoute from './test.route'
import appointmentRoute from './appointment'

interface Route {
  path: string;
  route: Router;
  middlewares?: { (): void }[];
}

const router = Router()

const setRoutes = (routes: Route[]) => {
  routes.forEach((route) => {
    if (Array.isArray(route.middlewares) && route.middlewares.length) {
      router.use(route.path, ...route.middlewares, route.route)
    } else {
      router.use(route.path, route.route)
    }
  })
}

const defaultRoutes: Route[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/test',
    route: testRoute,
  },
  {
    path: '/appointment',
    route: appointmentRoute
  }
  /*   {
    path: '/route',
    route: routeFile,
    middlewares: [middleware],
  }, */
]

const devRoutes: Route[] = []

setRoutes(defaultRoutes)

if (config.meta.isDev) {
  setRoutes(devRoutes)
}

export default router
