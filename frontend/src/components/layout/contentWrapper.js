import React, {Component} from 'react';
import {Container} from "react-bootstrap";


export class ContentWrapper extends Component {
    render() {
        return (
            <Container style={styles}>
                {this.props.children}
            </Container>
        )
    }
}

const styles = {
    paddingTop: 15,
    maxWidth: '60%',
};