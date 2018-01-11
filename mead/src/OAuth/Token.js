export default class {

    constructor(data) {
        this.token = data;
        this.monitor = null;
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

            this.monitor = setInterval(() => {
                if (!this.fresh()) {
                    resolve();
                    clearInterval(this.monitor);
                }
            }, 3000);
        });
    }

    accessToken() {
        return this.token.access_token;
    }
}
