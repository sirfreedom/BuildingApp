import React, { Component } from 'react';
import { Layout } from './components/Layout/Layout';
import { LayoutAnonymous } from './components/Layout/LayoutAnonymous';

import { locale, loadMessages } from "devextreme/localization";

import esMessages from "devextreme/localization/messages/es.json";

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';

export default class App extends Component {
    static displayName = App.name;   
    static adaInfoKey = "adaInfo";

    constructor(props) {
        super(props);

        const adaInfo = App.adaInfo();

        this.state = adaInfo;
        this.userHasAuthenticated = this.userHasAuthenticated.bind(this);

        //seteo los controles en español
        loadMessages(esMessages);
        locale("es");
    }

    userHasAuthenticated = data => {
        const stateInfo = {
            isAuthenticated: data.authenticated,
            usuarioId: data.usuarioId,
            clienteSasaId: data.clienteSasaId,
            userName: data.userName,
            codAdministracion: data.codAdministracion,
            asciiCodAdministracion: data.asciiCodAdministracion
        };

        //guardo el storage
        localStorage.setItem(App.adaInfoKey, JSON.stringify(stateInfo));

        this.setState(stateInfo);
    }

    static renderAnnonymous(childProps) {
        return (<LayoutAnonymous childProps={childProps} /> );
    }

    static renderLogin(childProps) {
        return (<Layout childProps={childProps} /> );
    }

    static adaInfo() {
        const data = JSON.parse(localStorage.getItem(App.adaInfoKey));

        const defaultInfo = {
            isAuthenticated: false,
            usuarioId: null,
            clienteSasaId: null,
            userName: null,
            codAdministracion: null,
            asciiCodAdministracion: null
        };

        return data || defaultInfo;
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            usuarioId: this.state.usuarioId,
            userHasAuthenticated: this.userHasAuthenticated,
            clienteSasaId: this.state.clienteSasaId,
            userName: this.state.userName,
            codAdministracion: this.state.codAdministracion,
            asciiCodAdministracion: this.state.asciiCodAdministracion
        };

        return childProps.isAuthenticated === false
            ? App.renderAnnonymous(childProps)
            : App.renderLogin(childProps);
    }
}