import base64 from 'base-64';
import utf8 from 'utf8';
import Express from 'express';
import axios from 'axios';
import qs from 'qs';

// Constants
const CLIENT_ID = utf8.encode(process.env.CLIENT_ID);
const CLIENT_SECRET = utf8.encode(process.env.CLIENT_SECRET);
const app = new Express();
const port = 8000;

const spotifyAuthUrl = 'https://accounts.spotify.com/api/token';
const spotifyAuthClient = 'Basic ' + base64.encode(CLIENT_ID + ':' + CLIENT_SECRET);

const spotifySearchUrl = 'https://api.spotify.com/v1/search?';
const spotifyAlbumsUrl = 'https://api.spotify.com/v1/albums?';

// Configs
app.use(Express.json())

// Auth: get token
console.log(process.env.CLIENT_ID);
console.log(process.env.CLIENT_SECRET);

// -------------------------- API ENDPOINTS --------------------------

/**
 * Returns the five most likely matches for the user search parameters
 */
app.get('/search', (req, res) => {
    let authToken = '';
    getSpotifyAuthToken()
        .then(authRes => {
            authToken = authRes.data.access_token;
            // todo: sanitize user input
            // todo: decode %20 spaces
            if (req.query.search) {
                getSpotifySearch(authToken, req.query.search)
                    .then(searchRes => {
                        console.log(`Search query to Spotify successful. Returning ${searchRes.data.albums.items.length} items`);
                        res.send(searchRes.data);
                    })
                    .catch(err => {
                        console.log(`Spotify Search error => ${err}`);
                        res.status(err.response.status).send(`Spotify Search error => ${err}`);
                    });
            } else {
                console.log(`Search parameters are empty. Process aborted`);
                res.status(err.response.status).send(`Search parameters are empty. Process aborted`);
            }
        }).catch(err => {
            console.log(`Spotify Auth error ${err}`);
            res.status(err.response.status).send(`Spotify Auth error => ${err}`);
        });
});

/**
 * Get auth token to access Spotify API.
 * Returns a Promise with the response
 */
async function getSpotifyAuthToken() {
    let data = qs.stringify({
        'grant_type': 'client_credentials'
    });
    let config = {
        method: 'post',
        url: spotifyAuthUrl,
        headers: {
            'Authorization': spotifyAuthClient,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
    };
    return await axios(config);
}

async function getSpotifySearch(authToken, searchQuery) {
    let url = spotifySearchUrl + 'q=' + searchQuery + '&type=album&limit=5';
    let config = {
        method: 'get',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + authToken,
        }
    };
    return await axios(config);
}

app.get('/albums', (req, res) => {
    // todo: replace this with session var or crypted cookie for authToken
    let authToken = '';
    getSpotifyAuthToken()
        .then(authRes => {
            authToken = authRes.data.access_token;
            if (req.query.albumId) {
                getSpotifyAlbum(authToken, req.query.albumId)
                    .then(albumRes => {
                        if (albumRes.data.albums[0] !== null) {
                            let responsePayload = {
                                id: albumRes.data.albums[0].id,
                                artists: albumRes.data.albums[0].artists,
                                copyrights: albumRes.data.albums[0].copyrights,
                                images: albumRes.data.albums[0].images[0],
                                label: albumRes.data.albums[0].label,
                                name: albumRes.data.albums[0].name,
                                release_date: albumRes.data.albums[0].release_date,
                            }
                            console.log(`Albums query to Spotify successful. Returning found album`);
                            res.send(responsePayload);
                        } else {
                            res.status(404).send(`Spotify Album error => Requested album does not exist`);
                        }
                    })
                    .catch(err => {
                        console.log(`Spotify Album error => ${err}`);
                        console.log(err)
                        res.status(err.response.status).send(`Spotify Album error => ${err}`);
                    });
            } else {
                console.log(`Album ID parameter is empty. Process aborted`);
                res.status(err.response.status).send(`Album ID parameter is empty. Process aborted`);
            }
        }).catch(err => {
            console.log(`Spotify Auth error => ${err}`);
            res.status(err.response.status).send(`Spotify Auth error => ${err}`);
        });
});

async function getSpotifyAlbum(authToken, albumId) {
    let url = spotifyAlbumsUrl + 'ids=' + albumId;
    let config = {
        method: 'get',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + authToken,
        }
    };
    return await axios(config);
}

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});