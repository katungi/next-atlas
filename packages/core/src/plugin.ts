import { Compiler } from "webpack"
import { Context } from "./server/router"
import consola from 'consola'
import { createLocalService } from "./server/local"
import { createRPCServer } from "./server/rpc"
import {colors} from 'consola/utils'
import type { NextConfig } from 'next/dist/server/config-shared'
import { LOCAL_CLIENT_PORT } from '@next-atlas/shared'
import {ip} from 'address'

export class Plugin {
    context: Context
    running: boolean = false
    Constructor(context: Context) {
        this.context = context
    }

    apply(compiler: Compiler) {
        compiler.hooks.emit.tap('NextAtlasPlugin', () => {
            if (!this.running && this.context.dev && this.context.runtime === 'node' && typeof window === 'undefined') {
                const options = compiler.options
        
                createLocalService()
                createRPCServer(options, this.context)
        
                consola.log(colors.gray(` 🌎 Next Atlas ${process.env.VERSION}`))
                consola.log('')
                this.running = true
              }
        })
    }
}

export function withNextAtlas(nextConfig: NextConfig): NextConfig {
    const nextAtlasPlugin: NextConfig = {
        webpack: (config, context) => {
            if(!context.isServer) return config
            if(!context.dev) return config

            const runtime = context.isServer ? (context.nextRuntime === 'edge' ? 'edge' : 'node') : 'browser'
            //@ts-ignore
            config.plugins.push(new Plugin({ ...context, runtime, nextConfig }))
      
            return config
        },

        rewrites: async () => {
            const nextRewrites = await nextConfig.rewrites?.()
            if (process.env.NODE_ENV === 'production') return nextRewrites || []
      
            const obj = {
              source: '/__next_devtools__/client/:path*',
              destination: `http://${ip('lo')}:${LOCAL_CLIENT_PORT}/__next_devtools__/client/:path*`,
            }
            if (Array.isArray(nextRewrites)) {
              return [...nextRewrites, obj]
            } else if (nextRewrites instanceof Object) {
              return {
                ...nextRewrites,
                fallback: [...(nextRewrites.fallback || []), obj],
              }
            }
            return [obj]
          },
    }

    return Object.assign({}, nextConfig, nextAtlasPlugin)
}