import request from 'supertest'
import {app, VideoType} from "../src/settings";

describe('/videos', () => {

    let newVideo: VideoType | null = null;

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET videos database', async () => {
        await request(app)
            .get('/videos')
            .expect(200, [])
    })

    it('- GET videos by ID with incorrect id', async () => {
        await request(app)
            .get('/videos/-1')
            .expect(404)
    })

    it('- POST does not create the video with incorrect title, author and availableResolutions)', async () => {
        await request(app)
            .post('/videos/')
            .send({title: '', author: '', availableResolutions: ['bad quality']})
            .expect(400, {
                errorsMessages: [
                    {message: 'Invalid title', field: 'title'},
                    {message: 'Invalid author', field: 'author'},
                    {message: 'Invalid availableResolutions', field: 'availableResolutions'}
                ]
            })

        await request(app)
            .get('/videos')
            .expect(200, [])

    })

    it('+ POST create video with correct data', async () => {
        const createVideo = await request(app)
            .post('/videos')
            .send({title: 'newTitle 1', author: 'newAuthor 1', availableResolutions: ['P1080']})
            .expect(201)

        newVideo = createVideo.body

        expect(newVideo).toEqual({
            id: expect.any(Number),
            title: 'newTitle 1',
            author: 'newAuthor 1',
            availableResolutions: ['P1080'],
            canBeDownloaded: expect.any(Boolean),
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String)
        })

        await request(app)
            .get('/videos')
            .expect(200, [newVideo])
    })

    it('+ GET videos by ID with correct id', async () => {
        await request(app)
            .get('/videos/' + newVideo!.id)
            .expect(200, newVideo)
    })

    it('- PUT video by ID with incorrect id', async () => {
        await request(app)
            .put('/videos/' + -1)
            .send({title: 'Bad title', author: 'Bad author'})
            .expect(404)

        await request(app)
            .get('/videos')
            .expect(200, [newVideo])
    })

    it('+ PUT video by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + newVideo!.id)
            .send({
                title: 'newTitle 2',
                author: 'newAuthor 2',
                publicationDate: '2023-11-10T18:22:24.043Z',
            })
            .expect(204)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual({
            ...newVideo,
            title: 'newTitle 2',
            author: 'newAuthor 2',
            publicationDate: '2023-11-10T18:22:24.043Z',
        })
        newVideo = res.body[0]
    })

    it('- DELETE video by ID with incorrect id', async () => {
        await request(app)
            .delete('/videos/' + -1)
            .expect(404)

        await request(app)
            .get('/videos')
            .expect(200, [newVideo])
    })

    it('+ DELETE video by ID with correct id', async () => {
        await request(app)
            .delete('/videos/' + newVideo!.id)
            .expect(204)

        await request(app)
            .get('/videos')
            .expect(200, [])
    })
})