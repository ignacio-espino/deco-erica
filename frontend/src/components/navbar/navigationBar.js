import React, {Component} from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Application} from "../app/app";


export class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.app = new Application();
    }

    render() {
        return (
            <Navbar expand="lg" style={{boxShadow: '5px -1px 5px rgba(0,0,0,.6)'}}>
                <Navbar.Brand href="/">
                    <img src={"deco.png"} height="55" width="auto" className="d-inline-block align-top" alt="Tasks"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href={this.app.URLS.home} active={this.props.homeLinkActive}>
                            Cotizador
                        </Nav.Link>
                        <NavDropdown title="Admin" id="navbar-edit-menu">
                            <NavDropdown.Item href={this.app.URLS.admin}>BackOffice</NavDropdown.Item>
                            <NavDropdown.Item href={this.app.URLS.createQuotation}>Nueva Cotización</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <NavDropdown title={this.props.username} id="navbar-user-menu">
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}