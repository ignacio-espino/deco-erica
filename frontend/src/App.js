import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {ApiConnector} from "./components/api/apiConnector";
import {TasksView} from "./components/views/tasksView";
import {LoginView} from "./components/views/loginView";
import {LocalStorage} from "./components/api/localStorage";
import {LogoutView} from "./components/views/logoutView";
import {CreateTaskView} from "./components/views/createTaskView";
import {Application} from "./components/app/app";
import {CreateQuotationView} from "./components/views/createQuotation";


class App extends Component {
    constructor(props) {
        super(props);

        this.loginUser = this.loginUser.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.userIsLoggedIn = this.userIsLoggedIn.bind(this);

        this.getTask = this.getTask.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.getProductsInformation = this.getProductsInformation.bind(this);
        this.createTask = this.createTask.bind(this);
        this.createQuotation = this.createQuotation.bind(this);
        this.calculateMoneyValues = this.calculateMoneyValues.bind(this);

        this.createTaskViewComponent = this.createTaskViewComponent.bind(this);
        this.createQuotationViewComponent = this.createQuotationViewComponent.bind(this);
        this.TasksViewComponent = this.TasksViewComponent.bind(this);
        this.loginViewComponent = this.loginViewComponent.bind(this);
        this.logoutViewComponent = this.logoutViewComponent.bind(this);

        this.app = new Application();
        this.apiConnector = new ApiConnector(this.getHost() + '/api/',
            () => {},
            () => {LocalStorage.removeUserData(); window.location.reload(false);});
    }

    getHost() {
        // TODO: this should live in app.js
        const hostname = window.location.hostname;
        if (hostname === "localhost") {
            return 'http://localhost:8000';
        } else {
            return '';
        }
    }

    getUser() {
        return LocalStorage.fetchUser()
    }

    getUsername() {
        return (this.userIsLoggedIn()) ? this.getUser().name : '';
    }

    userIsLoggedIn() {
        return LocalStorage.hasUserData();
    }

    async loginUser(username, password) {
        let parameters = {
            'username': username,
            'password': password,
        };

        const response = await this.apiConnector.post('login', parameters);

        if (response.isSuccessful()) {
            const user = response.data()['user'];
            const token = response.data()['token'];
            LocalStorage.saveUserData(user, token);
        } else {
            window.alert(response.message());
        }
    }

    async logoutUser() {
        let parameters = {
            'user_id': this.getUser().id || '',
        };
        await this.apiConnector.post('logout', parameters);
        LocalStorage.removeUserData();
    }

    async getTasks(queryString='', page=0, resultsPerPage=50) {
        debugger;
        const parameters = {
            'query': encodeURIComponent(queryString),
            'page': page,
            'results_per_page': resultsPerPage,
        };
        const response = await this.apiConnector.get('tasks', parameters);
        return response.data();
    }

    async getProductsInformation() {
        const parameters = {};
        const response = await this.apiConnector.get('products-information', parameters);
        return response.data();
    }

    async getTask(taskId='') {
        const parameters = {
            'task_id': taskId,
        };
        const response = await this.apiConnector.get('task', parameters);
        return response.data();
    }

    async createTask(name, description, callback=()=>{}) {
        const parameters = {'name': name, 'description': description};
        const response = await this.apiConnector.post('create-task', parameters);
        if (response.isSuccessful()) {
            window.alert(`Successful created task: ${response.data().name}`);
            callback();
        } else {
            window.alert(response.message());
        }
    }

    async createQuotation(
        number,
        seller,
        name,
        cellphone,
        address,
        email,
        date,
        deliveryDate,
        discount,
        remainingEntries,
        remainingUpholsterEntries,
        callback = () => {
        }) {
        const parameters = {
            'number': number,
            'seller': seller,
            'name': name,
            'cellphone': cellphone,
            'address': address,
            'email': email,
            'date': date,
            'deliveryDate': deliveryDate,
            'discount': discount,
            'remainingEntries': remainingEntries,
            'remainingUpholsterEntries': remainingUpholsterEntries,
        };
        console.log(parameters)
        const response = await this.apiConnector.post('create-quotation', parameters);
        if (response.isSuccessful()) {
            window.alert('Successful created task');
            callback();
        } else {
            window.alert(response.message());
        }
    }

    async calculateMoneyValues(remainingEntries, remainingUpholsterEntries, callback = () => {}) {
        debugger;
        const parameters = {
            'entries' : remainingEntries,
            'upholsterEntries': remainingUpholsterEntries
        }
        const response = await this.apiConnector.post('calculate-money-values', parameters);
        if (response.isSuccessful()) {
            window.alert('valores calculados');
            debugger;
            callback(response.data());
        } else {
            window.alert(response.message());
        }

    }

    TasksViewComponent(props) {
        return (
            <TasksView
                {...props}
                userIsLoggedIn={this.userIsLoggedIn()}
                username={this.getUsername()}
                getTasks={this.getTasks}
            />
        );
    }

    createTaskViewComponent(props) {
        return (
            <CreateTaskView
                {...props}
                userIsLoggedIn={this.userIsLoggedIn()}
                username={this.getUsername()}
                createTask={this.createTask}
            />
        );
    }

    createQuotationViewComponent(props) {
        return (
            <CreateQuotationView
                {...props}
                userIsLoggedIn={this.userIsLoggedIn()}
                username={this.getUsername()}
                createTask={this.createQuotation}
                calculateValues={this.calculateMoneyValues}
                getProductsDetail={this.getProductsInformation}
            />
        );
    }

    loginViewComponent(props) {
        return (
            <LoginView
                {...props}
                loginUser={this.loginUser}
                userIsLoggedIn={this.userIsLoggedIn()}
            />
        );
    }

    logoutViewComponent(props) {
        return (
            <LogoutView
                {...props}
                logoutUser={this.logoutUser}
                userIsLoggedIn={this.userIsLoggedIn()}
            />
        );
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path={this.app.URLS.login} render={this.loginViewComponent}/>
                    <Route path={this.app.URLS.logout} render={this.logoutViewComponent}/>
                    <Route path={this.app.URLS.createTask} render={this.createTaskViewComponent}/>
                    <Route path={this.app.URLS.createQuotation} render={this.createQuotationViewComponent}/>
                    <Route path={this.app.URLS.home} render={this.createQuotationViewComponent}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
