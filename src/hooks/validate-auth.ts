import { NotAuthenticated } from '@feathersjs/errors'
import type { HookContext, NextFunction } from '../declarations'

// Check if user is stored in session
export const validateAuth = async (context: HookContext) => {
    if (!context.params.session?.user) {
        throw new NotAuthenticated('Not authenticated')
    }
}