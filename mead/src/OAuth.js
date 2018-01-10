import axios from 'axios';
import extend from './helpers/Extend.js';

function getAuthorisationCodeFromURL()
{
    const regex = RegExp(/code=(.+?)(\&|$)/).exec(location.search);
    return regex === null ? null : regex[1];
}

function userhasRefused() {
    return RegExp(/error=access_denied/).exec(location.search) !== null;
}

export default class OAuth {
    constructor(options) {
        this.options = extend({url: 'https://auth.debolk.nl/'}, options);
    }

    authenticate() {
        return new Promise((resolve, reject) => {
            const token = getAuthorisationCodeFromURL();
            if (token === null) {
                // Have we refused authentication before?
                if (userhasRefused()) {
                    reject('User has refused authorization');
                    return;
                }
                else {
                    // Not authenticated, must login
                    window.location = this.options.url
                                        + 'authenticate?response_type=code'
                                        + '&client_id=' + this.options.client
                                        + '&client_pass=' + this.options.secret
                                        + '&redirect_uri=' +this.options.callback
                                        + '&state=1';
                    return;
                }
            }

            // At this point, we have a valid authorization token
            // trade it for an access token
            axios.post(`${this.options.url}/token`, {
                grant_type: 'authorization_code',
                code: token,
                redirect_uri: this.options.callback,
                client_id: this.options.client,
                client_secret: this.options.secret,
            }).then((response) => {
                // Clear the browser URL for cleaner reloads
                history.pushState(null, '', this.options.callback);
                resolve(response.data.access_token);
            }).catch((error) => {
                reject('Failed to get OAuth authorization token');
            });
        });
    }
};
