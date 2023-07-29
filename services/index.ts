import { authOidcCallback } from './auth-oidc/callback/auth-oidc-callback'
import { authOidc } from './auth-oidc/auth-oidc'
import { aliases } from './aliases/aliases'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(authOidcCallback)
  app.configure(authOidc)
  app.configure(aliases)
}
