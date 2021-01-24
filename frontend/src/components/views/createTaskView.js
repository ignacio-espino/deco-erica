import React, {Component} from 'react';
import {MainLayout} from "../layout/mainLayout";
import {Button, Form, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";


export class CreateTaskView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: ""
        }

        this.reloadPage = this.reloadPage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount() {
        // TODO: this should be reified in a LoggedInComponent thing
        if (!this.props.userIsLoggedIn) {
            this.props.history.replace('/login');
        }
    }

    reloadPage() {
        this.props.history.go();
    }

    handleChange(event) {
        let valueName = event.target.name;
        let value = event.target.value;
        let stateData = this.state;
        stateData[valueName] = value;
        this.setState(stateData);
    }

    onSubmit() {
        if (this.state.total === "") {
            window.alert("Ingrese un total");
            return;
        }
        this.props.createTask(this.state.name, this.state.description, this.reloadPage);
    }

    render() {
        return (
            <MainLayout username={this.props.username}>
                <Row className="justify-content-md-center">
                    <Col sm={5}>
                        <Form.Group as={Row}>
                            <Col>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={this.state.name}
                                              onChange={this.handleChange} name="name"/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows="3" value={this.state.description}
                                              onChange={this.handleChange} name="description"/>
                            </Col>
                        </Form.Group>
                        <Button onClick={this.onSubmit}>Create</Button>
                    </Col>
                </Row>
            </MainLayout>
        )
    }
}
