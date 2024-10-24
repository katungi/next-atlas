import { WebSocketServer } from 'ws'
import { WebpackOptionsNormalized } from "webpack";
import { applyWSSHandler } from '@trpc/server/adapters/ws'
import { RPC_SERVER_PORT } from '@next-atlas/shared'
import { appRouter, Context } from "./router";
import { createContext } from './context';

export function createRPCServer(options: WebpackOptionsNormalized, context: Context) {
    const wss = new WebSocketServer({port: Number(RPC_SERVER_PORT)})
    const handler = applyWSSHandler({
        wss, 
        router: appRouter, 
        createContext: createContext(options, context) 
    })

    process.on('SIGTERM', () =>{
        handler.broadcastReconnectNotification()
        wss.close()
    })
}