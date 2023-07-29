import type { Params, ServiceInterface } from '@feathersjs/feathers'
import type { Application } from '../../../declarations'
import { Issuer } from 'openid-client'

import config from 'config'

type AuthOidcCallback = string
type AuthOidcCallbackData = any
type AuthOidcCallbackPatch = any
type AuthOidcCallbackQuery = any

export type { AuthOidcCallback, AuthOidcCallbackData, AuthOidcCallbackPatch, AuthOidcCallbackQuery }

export interface AuthOidcCallbackServiceOptions {
  app: Application
}

export interface AuthOidcCallbackParams extends Params<AuthOidcCallbackQuery> {
  session?: any
  query: {
    iss: string,
    code: string,
  }
}

export class AuthOidcCallbackService<ServiceParams extends AuthOidcCallbackParams = AuthOidcCallbackParams>
  implements ServiceInterface<AuthOidcCallback, AuthOidcCallbackData, ServiceParams, AuthOidcCallbackPatch>
{
  constructor(public options: AuthOidcCallbackServiceOptions) { }

  async find(params: ServiceParams): Promise<AuthOidcCallback> {
    const issuer = await Issuer.discover(config.get('oidc.gatewayUri'));
    const client = new issuer.Client({
      client_id: config.get('oidc.clientId'),
      client_secret: config.get('oidc.clientSecret'),
      redirect_uris: [config.get('oidc.redirectUris')],
      response_types: ['code'],
    })

    const codeVerifier = params.session.codeVerifier;
    const tokenSet = await client.callback(config.get('clientUrl') + '/auth-oidc/callback', { code: params.query.code, iss: params.query.iss }, { code_verifier: codeVerifier });
    const userinfo = await client.userinfo(tokenSet.access_token as string);

    params.session.user = userinfo;

    return '/'
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
