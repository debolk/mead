import axios from 'axios';
import Token from './Token';


export default class
{
    constructor(options) {
        this.options = options;
        this.storage = window.localStorage;
    }

    token() {
        return new Promise((resolve, reject) => {
            // Check for a stored token that is fresh
            const token = new Token(JSON.parse(this.storage.getItem('mead_oauth_token')));
            if (token.fresh()) {
                resolve(token);
                return;
            }
            else {
                // token has expired, yank it
                this.storage.removeItem('mead_oauth_token');
            }

            // Check for an authorization code
            const authorization = authorizationCode();
            if (authorization) {
                // Trade authorization token for access token
                retrieveAccessToken(this.options, authorization)
                    .then(({data}) => {
                        const access = new Token(data);
                        // Calculate expiry time
                        const expiry = new Date();
                        expiry.setSeconds(expiry.getSeconds() + parseInt(data.expires_in) - 60);
                        data.expires_at = expiry;
                        // store token for later re-use
                        this.storage.setItem('mead_oauth_token', JSON.stringify(data));
                        resolve(access);
                    })
                    .catch(() => {
                        reject('token_trading_failed');
                    });
            }
            else {
                // Check if the user refused permissions
                if (userHasRefusedPermission()) {
                    reject('user_refused_permission');
                    return;
                }

                // We are apparently at the very start, redirect to the authorization server
                window.location = generateAuthorizationURL(this.options);
            }
        });
    }
}

function authorizationCode() {
    const regex = RegExp(/code=(.+?)(\&|$)/).exec(window.location.search);
    return regex === null ? null : regex[1];
}


function userHasRefusedPermission() {
    return RegExp(/error=access_denied/).exec(window.location.search) !== null;
}

function generateAuthorizationURL(options) {
    return options.url
        + 'authenticate?response_type=code'
        + '&client_id=' + options.client
        + '&client_pass=' + options.secret
        + '&redirect_uri=' +options.callback
        + '&state=1';
}

function retrieveAccessToken(options, authorization) {
    return axios.post(`${options.url}/token`, {
        grant_type: 'authorization_code',
        code: authorization,
        redirect_uri: options.callback,
        client_id: options.client,
        client_secret: options.secret,
    });
}
