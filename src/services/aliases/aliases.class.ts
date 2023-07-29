import type { Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import wildDuckClient from '../../clients/wildduck.client'
import { faker } from '@faker-js/faker'
import { BadRequest } from '@feathersjs/errors'
import config from 'config'

interface Alias {
  success: boolean,
  id: string,
  address: string,
  main: boolean,
  user: string,
  tags: string[],
  created: string,
}

interface GetAddressInfoResponse {
  success: boolean,
  results: Alias[]
}

interface CreateAddressResponse {
  success: boolean,
  id: string,
}

type AliasesData = any
type AliasesPatch = any
type AliasesQuery = any

export type { Alias as Aliases, AliasesData, AliasesPatch, AliasesQuery }

export interface AliasesServiceOptions {
  app: Application
}

export interface AliasesParams extends Params<AliasesQuery> {
  session?: any
}

export class AliasesService<ServiceParams extends AliasesParams = AliasesParams>
  implements ServiceInterface<Alias, AliasesData, ServiceParams, AliasesPatch>
{
  constructor(public options: AliasesServiceOptions) { }

  async find(params: ServiceParams): Promise<Alias[]> {
    const userId = await this.getUserIdByEmailAddress(params)
    const { data: userAddressesResponse } = await wildDuckClient.get<GetAddressInfoResponse>(`/users/${userId}/addresses`)

    return userAddressesResponse.results
  }

  async create(data: AliasesData, params: ServiceParams): Promise<Alias>
  async create(data: AliasesData, params: ServiceParams): Promise<Alias | Alias[]> {
    const userId = await this.getUserIdByEmailAddress(params)
    const aliasFirstPart = faker.animal.crocodilia()
      .replace(/\D/, '')
      .replace(/\s/, '')
      .slice(10);

    const aliasSecondPart = faker.git.commitSha({ length: 5 });
    const alias = `${aliasFirstPart}-${aliasSecondPart}@${config.get('wildDuck.domain')}`;
    // const alias = `${faker.animal.crocodilia().replace(/\s/, '').slice(10)}-${faker.git.commitSha({ length: 5 })}`;

    const createResult = await wildDuckClient.post<CreateAddressResponse>(`/users/${userId}/addresses`, {
      address: alias
    })

    if (!createResult.data.success) {
      throw new BadRequest('Failed to create alias')
    }

    const { data: userAddressesResponse } = await wildDuckClient.get<GetAddressInfoResponse>(`/users/${userId}/addresses`)

    return userAddressesResponse.results

  }

  private async getUserIdByEmailAddress(params: ServiceParams): Promise<string> {
    const emails = params.session?.user?.emails;

    const addressInfoResponse = await Promise.any(emails.map((email: string) => wildDuckClient.get<Alias>(`addresses/resolve/${email}`)))

    return addressInfoResponse.data.user
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
