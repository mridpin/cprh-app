import chai from 'chai';
import supertest from 'supertest';
import sinon from 'sinon';

import app from '../src/api/server.js';
import SpotifyAPIService from "../src/service/spotifyAPIservice.js";

const expect = chai.expect;
const request = supertest(app);

// ------ GLOBAL CONSTANTS ------ // 
const spotifyAuthRes = {
    data: {
        access_token: '123',
    }
};

// Smoke test
describe('Smoke test', () => {
    it('should return true', () => {
        expect(1 + 1).to.equal(2);
    });
});

// ------ TESTS FOR SEARCH ENDPOINT ------ //
describe('/search endpoint tests', () => {
    // Afters
    afterEach(() => {
        sinon.restore();
    });
    it('400 empty search params', done => {
        const query = { search: '' };
        const expected = {
            status: 400,
            body: 'Search parameters are empty. Process aborted'
        }
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        request.get('/search')
            .query(query)
            .expect(expected.status, expected.body, done);

    });
    it('401 spotify invalid token error', done => {
        const query = { search: 'test' };
        const expected = {
            status: 500,
            body: 'Could not connect to Spotify API, please try again later or contact site admin'
        };
        const err = {
            status: 500,
            body: 'Could not connect to Spotify API, please try again later or contact site admin'
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { rej(err) }));
        request.get('/search')
            .query(query)
            .expect(expected.status, expected.body, done);
    });
    it('40X spotify search error', done => {
        const query = { search: 'test' };
        const expected = {
            status: 400,
            message: 'Spotify Search error => Invalid market code'
        };
        const err = {
            error: {
                status: 400,
                message: 'Invalid market code'
            }
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        sinon.stub(SpotifyAPIService, "getSpotifySearch").returns(new Promise((res, rej) => { rej(err) }));
        request.get('/search')
            .query(query)
            .expect(expected.status, expected.message, done);
    });
    it('200 spotify search response', done => {
        const query = { search: 'test' };
        const expected = {
            status: 200,
            data: {
                albums: {
                    items: ['album']
                }
            }
        };
        const response = {
            data: {
                albums: {
                    items: ['album']
                }
            }
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        sinon.stub(SpotifyAPIService, "getSpotifySearch").returns(new Promise((res, rej) => { res(response) }));
        request.get('/search')
            .query(query)
            .expect(expected.status, expected.data, done);
    });
});

// ------ TESTS FOR ALBUMS ENDPOINT ------ //
describe('/album endpoint tests', () => {
    // Afters
    afterEach(() => {
        sinon.restore();
    });
    it('400 empty album ID', done => {
        const query = { albumId: '' };
        const expected = {
            status: 400,
            body: 'Album ID parameter is empty. Process aborted'
        }
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        request.get('/albums')
            .query(query)
            .expect(expected.status, expected.body, done);
    });
    it('401 spotify invalid token error', done => {
        const query = { albumId: 'test123' };
        const expected = {
            status: 500,
            body: 'Could not connect to Spotify API, please try again later or contact site admin'
        };
        const err = {
            status: 500,
            body: 'Could not connect to Spotify API, please try again later or contact site admin'
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { rej(err) }));
        request.get('/albums')
            .query(query)
            .expect(expected.status, expected.body, done);
    });
    it('40X spotify album error', done => {
        const query = { albumId: 'test123' };
        const authRes = {
            data: {
                access_token: '123'
            }
        };
        const expected = {
            status: 400,
            message: 'Spotify Album error => Invalid album id'
        };
        const err = {
            error: {
                status: 400,
                message: 'Invalid album id'
            }
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(authRes) }));
        sinon.stub(SpotifyAPIService, "getSpotifyAlbum").returns(new Promise((res, rej) => { rej(err) }));
        request.get('/albums')
            .query(query)
            .expect(expected.status, expected.message, done);
    });
    it('404 spotify album does not exist', done => {
        const query = { albumId: 'test123' };
        const expected = {
            status: 404,
            body: 'Spotify Album error => Requested album does not exist'
        };
        const response = {
            status: 200,
            data: {
                albums: [null]
            }
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        sinon.stub(SpotifyAPIService, "getSpotifyAlbum").returns(new Promise((res, rej) => { res(response) }));
        request.get('/albums')
            .query(query)
            .expect(expected.status, expected.body, done);
    });
    it('200 spotify albums response', done => {
        const query = { albumId: 'test123' };
        const expected = {
            status: 200,
            data: {
                id: 'id123',
                artists: ['artist123'],
                copyrights: ['copyright123'],
                images: 1,
                label: 'label123',
                name: 'name123',
                release_date: 'date123',

            }
        };
        const response = {
            status: 200,
            data: {
                albums: [
                    {
                        id: 'id123',
                        artists: ['artist123'],
                        copyrights: ['copyright123'],
                        images: [1],
                        label: 'label123',
                        name: 'name123',
                        release_date: 'date123',
                    }
                ]
            }
        };
        // mock network calls to spotify
        sinon.stub(SpotifyAPIService, "getSpotifyAuthToken").returns(new Promise((res, rej) => { res(spotifyAuthRes) }));
        sinon.stub(SpotifyAPIService, "getSpotifyAlbum").returns(new Promise((res, rej) => { res(response) }));
        request.get('/albums')
            .query(query)
            .expect(expected.status, expected.data, done);
    });
});