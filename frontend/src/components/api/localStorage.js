export class LocalStorage {
    static saveUserData(user, token) {
        localStorage.setItem('logged_user', JSON.stringify(user));
        localStorage.setItem('logged_user_token', token);
    }

    static hasUserData() {
        return localStorage.getItem('logged_user') !== null;
    }

    static removeUserData() {
        localStorage.removeItem('logged_user');
        localStorage.removeItem('logged_user_token');
    }

    static fetchUser() {
        return JSON.parse(localStorage.getItem('logged_user'));
    }

    static fetchUserToken() {
        return localStorage.getItem('logged_user_token');
    }
}