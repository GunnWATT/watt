import * as functions from 'firebase-functions';
import { OAuth } from 'oauth';


const { key, secret } = functions.config().schoology;
const apiBase = 'https://api.schoology.com/v1/';

const oauth = new OAuth(
    `${apiBase}oauth/request_token`,
    `${apiBase}oauth/access_token`,
    key,
    secret,
    '1.0',
    null,
    'HMAC-SHA1'
);
oauth.setClientOptions({
    requestTokenHttpMethod: 'GET',
    accessTokenHttpMethod: 'GET',
    followRedirects: true
});

type OAuthToken = [token: string, token_secret: string, parsedQueryString: any];
export function getOAuthAccessToken(token: string, tokenSecret: string) {
    return new Promise<OAuthToken>((res, rej) => {
        oauth.getOAuthAccessToken(token, tokenSecret, (err, ...out) => {
            if (err) rej(err);
            else res(out);
        })
    })
}
export function getOAuthRequestToken() {
    return new Promise<OAuthToken>((res, rej) => {
        oauth.getOAuthRequestToken((err, ...out) => {
            if (err) rej(err);
            else res(out);
        })
    })
}

export function get(url: string, token: string, tokenSecret: string) {
    return new Promise<any>((res, rej) => {
        oauth.get(new URL(url, apiBase).toString(), token, tokenSecret, (err, result, response) => {
            if (err) rej({...err, response});
            else res(JSON.parse(result!.toString()));
        })
    })
}
