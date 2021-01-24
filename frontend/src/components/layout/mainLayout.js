import React, {Component} from 'react';
import {NavigationBar} from "../navbar/navigationBar";
import {ContentWrapper} from "./contentWrapper";


export class MainLayout extends Component {
    render() {
        return (
            <div className={'body'} style={styleBody}>
                <NavigationBar {...this.props}/>
                <ContentWrapper>
                    {this.props.children}
                </ContentWrapper>
            </div>
        );
    }
}

const styleBody = {
    height: '100vh',
    fontFamily: 'sans-serif',
    overflowY: 'scroll',
};

