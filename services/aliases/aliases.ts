import type { Application } from '../../declarations'
import { validateAuth } from '../../hooks/validate-auth'
import { AliasesService, getOptions } from './aliases.class'

export const aliasesPath = 'aliases'
export const aliasesMethods = ['find', 'create'] as const

export * from './aliases.class'

export const aliases = (app: Application) => {
  app.use(aliasesPath, new AliasesService(getOptions(app)), {
    methods: aliasesMethods,
    events: []
  })

  app.service(aliasesPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [
        validateAuth
      ],
      find: [],
      create: [],
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [aliasesPath]: AliasesService
  }
}
