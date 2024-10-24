import { WebpackOptionsNormalized } from "webpack";

export async function getLogs(options: WebpackOptionsNormalized) {
    console.log('getLogs', options)
    return {
        logs: [],
    }
}