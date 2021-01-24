export class BuildResponse {
    newFrom(status, jsonResponse, onSuccessCallback=null, onUnauthorizedCallback=null) {
        if (status === 401 || status === 403) {
            return new UnauthorizedResponse(jsonResponse, onUnauthorizedCallback);
        } else if (status === 500) {
            window.alert('Connection problems');
        } else {
            return new SuccessfulResponse(jsonResponse, onSuccessCallback);
        }
    }
}

export class SuccessfulResponse {
    constructor(apiResponse, callback=null) {
        this._apiResponse = apiResponse;
        if (callback) {
            callback();
        }
    }

    isSuccessful() {
        return this._apiResponse.success;
    }

    data() {
        return this._apiResponse.data;
    }

    errors() {
        return this._apiResponse.errors;
    }

    message() {
        return (this.isSuccessful()) ? 'OK' : this.errors();
    }
}

export class UnauthorizedResponse {
    constructor(apiResponse, callback=null) {
        this._apiResponse = apiResponse;
        if (callback) {
            callback();
        }
    }

    isSuccessful() {
        return false;
    }

    data() {
        return this._apiResponse;
    }

    errors() {
        return this._apiResponse;
    }

    message() {
        return (this.isSuccessful()) ? 'OK' : this.errors();
    }
}
