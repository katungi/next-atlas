import { initTRPC } from '@trpc/server';
import type { NextConfig, WebpackConfigContext } from 'next/dist/server/config-shared'
import { WebpackOptionsNormalized } from 'webpack';
import { getLogs } from '../features/logs';

export interface Context extends WebpackConfigContext {
    runtime: 'node' | 'edge' | 'browser';
    nextConfig: NextConfig
}

const t = initTRPC.context<() => { options: WebpackOptionsNormalized; context: Context }>().create()

export const appRouter = t.router({
    getLogs: t.procedure.query(async (opts) => {
        const options = opts.ctx.options
        return await getLogs(options)
    })
})

export type AppRouter = typeof appRouter;