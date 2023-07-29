import type { Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

import { Issuer, generators } from 'openid-client'
import config from 'config';


type AuthOidcResponse = string
type AuthOidcQuery = any

export type { AuthOidcResponse as AuthOidc, AuthOidcQuery }

export interface AuthOidcServiceOptions {
  app: Application
}

export interface AuthOidcParams extends Params<AuthOidcQuery> {
  session?: any
}

export class AuthOidcService<ServiceParams extends AuthOidcParams = AuthOidcParams>
  implements ServiceInterface<AuthOidcResponse, ServiceParams>
{
  constructor(public options: AuthOidcServiceOptions) { }

  async find(params: ServiceParams): Promise<AuthOidcResponse> {
    const issuer = await Issuer.discover(config.get('oidc.gatewayUri'));
    const client = new issuer.Client({
      client_id: config.get('oidc.clientId'),
      client_secret: config.get('oidc.clientSecret'),
      redirect_uris: [config.get('oidc.redirectUris')],
      response_types: ['code'],
    })
    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);

    const url = client.authorizationUrl({
      redirect_uri: config.get('clientUrl') + '/auth-oidc/callback',
      scope: 'openid profile offline_access',
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    params.session.codeVerifier = codeVerifier;
    return url;
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
