import React, {Component} from 'react';
import {ContentWrapper} from "../layout/contentWrapper";
import {Button, Col, Form, Jumbotron, Row} from "react-bootstrap";


export class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submitting: false,
        };

        this.resetValues = this.resetValues.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {
        if (this.props.userIsLoggedIn) {
            this.props.history.replace('/');
        }
    }

    async onSubmit() {
        await this.props.loginUser(this.state.username, this.state.password);
        this.resetValues();
        this.props.history.replace('/');
    }

    resetValues() {
        this.setState({submitting: false, username: '', password: ''});
    }

    onChangeUsername(event) {
        const username = event.target.value;
        this.setState({username: username});
    }

    onChangePassword(event) {
        const password = event.target.value;
        this.setState({password: password});
    }

    render() {
        return (
            <div className='body' style={styleBody}>
                <ContentWrapper>
                    <Row className="justify-content-md-center">
                        <Col xs lg="5">
                            <Jumbotron>
                                <h1>Login</h1>
                                <Form>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Username" onChange={this.onChangeUsername}/>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" onChange={this.onChangePassword}/>
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        onClick={this.state.submitting ? null : () => this.setState({submitting: true}, this.onSubmit)}
                                        disabled={this.state.submitting}>
                                        {this.state.submitting ? 'Loading...' : 'Submit'}
                                    </Button>
                                </Form>
                            </Jumbotron>
                        </Col>
                    </Row>
                </ContentWrapper>
            </div>
        )
    }
}

const styleBody = {
    height: '100vh',
    backgroundColor: '#303030',
    fontFamily: 'sans-serif',
    overflowY: 'scroll',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
