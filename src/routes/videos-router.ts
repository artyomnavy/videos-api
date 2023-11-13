import {Request, Response, Router} from "express";
import {
    CreateVideoDto, ErrorType,
    Params,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, UpdateVideoDto,
    VideoType
} from "../settings";

export let videos: VideoType[] = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-11-08T18:19:41.398Z",
        publicationDate: "2023-11-08T18:19:41.398Z",
        availableResolutions: [
            "P144"
        ]
    }
]

export const AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
export const videosRouter = Router({})

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos)
})

videosRouter.get('/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    let video = videos.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    } else {
        res.send(video)
    }
})

videosRouter.post('/', (req: RequestWithBody<CreateVideoDto> , res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid title', field: 'title'})
    }

    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author', field: 'author'})
    }

    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions', field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const createdAt = new Date()
    const publicationDate = new Date()
    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }

    videos.push(newVideo)

    res.status(201).send(newVideo)

})

videosRouter.put('/:id', (req: RequestWithParamsAndBody<Params, UpdateVideoDto>, res) => {
    const id = +req.params.id

    let errors: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body

    if (!title || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid title', field: 'title'})
    }

    if (!author || author.trim().length < 1 || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author', field: 'author'})
    }

    if (Array.isArray(availableResolutions) && availableResolutions.length) {
        availableResolutions.map(r => {
            !AvailableResolutions.includes(r) && errors.errorsMessages.push({
                message: 'Invalid availableResolutions', field: 'availableResolutions'
            })
        })
    } else {
        availableResolutions = []
    }

    if (typeof canBeDownloaded === 'undefined') {
        canBeDownloaded = false
    }

    if (typeof minAgeRestriction !== 'undefined' && typeof minAgeRestriction === 'number') {
        (minAgeRestriction < 1 || minAgeRestriction > 18) && errors.errorsMessages.push({message: 'Invalid minAgeRestriction', field: 'minAgeRestriction'})
    } else {
        minAgeRestriction = null
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const videoIndex = videos.findIndex(v => v.id === id)
    const video = videos.find(v => v.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    }

    const updatedVideo = {
        ...video,
        id,
        canBeDownloaded,
        minAgeRestriction,
        title,
        author,
        availableResolutions: video.availableResolutions.length ? video.availableResolutions : availableResolutions,
        publicationDate: publicationDate ? publicationDate : video.publicationDate
    }

    videos.splice(videoIndex, 1, updatedVideo)

    res.sendStatus(204)
})

videosRouter.delete('/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id

    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === id) {
            videos.splice(i, 1);
            res.sendStatus(204)
            return
        }
    }

    res.sendStatus(404)
})