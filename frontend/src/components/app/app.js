export class Application {
    constructor() {
        this.URLS = {
            home: "/",
            admin: "http://localhost:8000/admin/core/", // TODO: fixme!
            login: "/login",
            logout: "/logout",
            createTask: "/create-task",
            createQuotation: "/create-quotation",
        }
    }
}
