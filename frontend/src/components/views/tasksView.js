import React, {Component} from 'react';
import {MainLayout} from "../layout/mainLayout";
import {Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";


export class TasksView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tasks: []
        }

        this._renderNoTasks = this._renderNoTasks.bind(this);
    }

    async componentDidMount() {
        // TODO: this should be reified in a LoggedInComponent thing
        if (!this.props.userIsLoggedIn) {
            this.props.history.replace('/login');
        } else {
            const tasks = await this.props.getTasks();
            this.setState({tasks: tasks});
        }
    }

    _renderNoTasks() {
        if(this.state.tasks.length === 0) {
            return (
                <Row className="justify-content-md-center">
                    <Col sm={5}>
                        <p>No tasks</p>
                    </Col>
                </Row>
            )
        }
    }

    render() {
        return (
            <MainLayout username={this.props.username} homeLinkActive={true}>
                {this._renderNoTasks()}
                {this.state.tasks.map(task =>
                    <Row className="justify-content-md-center">
                        <Col sm={5}>
                            <p>Task: {task.name}</p>
                        </Col>
                    </Row>
                )}
            </MainLayout>
        )
    }
}
