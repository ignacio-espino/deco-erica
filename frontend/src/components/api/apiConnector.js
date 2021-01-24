import {BuildResponse} from "./response";
import {LocalStorage} from "./localStorage";

export class ApiConnector {
    constructor(apiBaseUrl, onSuccessCallback=null, onUnauthorizedCallback=null) {
        this._apiBaseUrl = apiBaseUrl;
        this._onSuccessCallback = onSuccessCallback;
        this._onUnauthorizedCallback = onUnauthorizedCallback;
    }

    baseUrl() {
        return this._apiBaseUrl;
    }

    async get(url, parameters = {}) {
        const [status, apiResponse] = await this._makeRequest(url, 'GET', parameters);
        return new BuildResponse().newFrom(status, apiResponse, this._onSuccessCallback, this._onUnauthorizedCallback);
    }

    async post(url, parameters) {
        const [status, apiResponse] = await this._makeRequest(url, 'POST', parameters);
        return new BuildResponse().newFrom(status, apiResponse, this._onSuccessCallback, this._onUnauthorizedCallback);
    }

    async _makeRequest(url, method, parameters) {
        try {
            let options = {method: method, headers: {'Content-Type': 'application/json'}};
            url += '/';

            if (parameters) {
                if (method === 'GET') {
                    url += '?' + this._paramsToQueryStr(parameters);
                } else {
                    options.body = JSON.stringify(parameters);
                }
            }

            const token = LocalStorage.fetchUserToken();
            if (token) {
                options.headers['Authorization'] = 'Token ' + token;
            }

            const res = await fetch(this._apiBaseUrl + url, options);
            return [res.status, await res.json()];
        } catch (e) {
            console.log(e);
        }
    }

    _listToQueryStr(key, listElements) {
        return listElements.map(listElement => key + '[]=' + listElement).join('&');
    }

    _paramsToQueryStr(params) {
        return Object.keys(params).map(key =>
            (Array.isArray(params[key])) ? this._listToQueryStr(key, params[key]) : key + '=' + params[key]).join('&');
    }
}
