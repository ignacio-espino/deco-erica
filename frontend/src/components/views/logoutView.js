import React, {Component} from 'react';


export class LogoutView extends Component {
    async componentDidMount() {
        if (!this.props.userIsLoggedIn) {
            this.props.history.replace('/');
        }

        await this.props.logoutUser();
        this.props.history.replace('/');
    }

    render() {
        return <p>Logging out...</p>;
    }
}
