import { http } from '@feathersjs/transport-commons'
import type { Application } from '../../../declarations'
import { AuthOidcCallbackService, getOptions } from './auth-oidc-callback.class'

export const authOidcCallbackPath = 'auth-oidc/callback'
export const authOidcCallbackMethods = ['find'] as const

export * from './auth-oidc-callback.class'

export const authOidcCallback = (app: Application) => {
  // TODO: fix this to use the correct type
  // @ts-ignore
  app.use(authOidcCallbackPath, new AuthOidcCallbackService(getOptions(app)), {
    methods: authOidcCallbackMethods,
    events: []
  }, (req: any, res: any) => {

    return res.redirect(res.data);
  })

  app.service(authOidcCallbackPath).hooks({
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

declare module '../../../declarations' {
  interface ServiceTypes {
    [authOidcCallbackPath]: AuthOidcCallbackService
  }
}
