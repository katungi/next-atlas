import { WebpackOptionsNormalized } from "webpack";
import { Context } from "./router";


export function createContext(options: WebpackOptionsNormalized, context: Context) {
    return () => ({ options, context })
}