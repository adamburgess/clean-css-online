import { minify } from './minify'

export interface WorkerInput {
    id: number
    text: string
}

export interface WorkerOutput {
    id: number
    data: ReturnType<typeof minify>
}
