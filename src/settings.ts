import express, {Request, Response} from "express"
import {AvailableResolutions, videos, videosRouter} from "./routes/videos-router";
import {testingRouter} from "./routes/testing-router";

export const app = express()

app.use(express.json())

export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: typeof AvailableResolutions
}

export type Params = {
    id: string
}

export type CreateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

export type UpdateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
}

export type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

type ErrorMessageType = {
    message: string,
    field: string
}

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithParamsAndBody<P, B> = Request<P, {}, B, {}>

app.use('/videos', videosRouter)
app.use('/testing', testingRouter)