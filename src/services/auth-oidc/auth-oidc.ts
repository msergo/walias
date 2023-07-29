import type { Application } from '../../declarations'
import { AuthOidcService, getOptions } from './auth-oidc.class'

export const authOidcPath = 'auth-oidc'
export const authOidcMethods = ['find'] as const

export * from './auth-oidc.class'

export const authOidc = (app: Application) => {
  // TODO: fix this to use the correct type
  // @ts-ignore
  app.use(authOidcPath, new AuthOidcService(getOptions(app)), {
    methods: authOidcMethods,
    events: []
  }, (req: any, res: any) => {

    return res.redirect(res.data);
  })

  app.service(authOidcPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    [authOidcPath]: AuthOidcService
  }
}
