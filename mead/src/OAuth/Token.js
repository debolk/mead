export default class {

    constructor(data) {
        this.token = data;
    }

    fresh() {
        if (!this.token || !this.token.expires_at) {
            return false;
        }

        return new Date() < new Date(this.token.expires_at);
    }

    whenExpired() {
        return new Promise((resolve, reject) => {
            if (!this.fresh()) {
                resolve();
            }

            const monitor = setInterval(() => {
                console.log('Testing token expiry');
                if (!this.fresh()) {
                    console.log('stale');
                    resolve();
                }
            }, 3000);
        });
    }

    accessToken() {
        return this.token.access_token;
    }
}
