import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { AccountService } from './../../services/AccountService';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';

export class Login extends Component {

    constructor(props) {
        super(props);

        let savedData = {
            username: "",
            password: "",
            codAdministracion: "",
            hash: "",
        };

        const savedDataText = localStorage.getItem("loginData");

        if (savedDataText !== undefined && savedDataText !== null && savedDataText !== "")
            savedData = JSON.parse(savedDataText);

        const defaultData = {
            username: savedData.username,
            password: savedData.password,
            codAdministracion: savedData.codAdministracion,
            error: false,
            saveCredential: true,
            hash: savedData.hash,
            onLogin: false
        };

        this.state = defaultData;
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
        this.handleResponse = this.handleResponse.bind(this);

        //lo marco para ir al dir base
        this.props.history.replace("/");

        //lo deslogueo
        const userHasAuthenticated = this.props.userHasAuthenticated;
        userHasAuthenticated({
            authenticated: false,
            usuarioId: null,
            clienteSasaId: null
        });

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleChangeCheckbox(e) {
        const { name, checked } = e.target;
        this.setState({ [name]: checked });
    }

    login() {
        const userHasAuthenticated = this.props.userHasAuthenticated;
        this.setState({ onLogin: true });

        const data = {
            username: this.state.username,
            password: this.state.password,
            codAdministracion: this.state.codAdministracion,
            hash: this.state.hash
        };

        //guardo la info
        if (this.state.saveCredential === true) {
            localStorage.setItem("loginData", JSON.stringify(data));
        }
        else {
            localStorage.setItem("loginData", "");
        }

        AccountService.login(data
            , (response) => {
                //si pudo loguearse
                response.json().then((data) => {
                    if (data.usuarioId) {
                        userHasAuthenticated({
                            authenticated: true,
                            usuarioId: data.usuarioId,
                            clienteSasaId: data.clienteSasaId
                        });
                    };
                });
                this.setState({ onLogin: false });
            }
            , (err) => { this.setState({ error: true, onLogin: false }); }
        );
    }

    handleResponse(e) {
        //cancelo el submit del form
        e.preventDefault();
        this.login();
    }

    render() {
        const inputStyle = {
            paddingRight: "5px",
            maxWidth: "400px",
            width: "90%",
            alignSelf: "center",
            margin: "10px",
        };

        const flexColumnStyle = {
            display: "flex",
            flexDirection: "column",
            alignitems: "flex-start",
            justifyContent: "center"
        };

        const boxStyle = {
            display: "flex",
            flexDirection: "column",
            margin: "60px auto",
            alignitems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: "500px",
        }

        const mediaStyle = {
            height: 140
        }

        const titleStyle = {
            border: 0,
            color: 'white',
            height: 48,
            padding: '10px 30px',
        }

        return (
            <div>
                <AppBar style={{left:"0", top:"0"}} position="absolute">
                <Toolbar>
                    <Typography variant="h5" style={titleStyle}>
                        Bienvenido - Portal ADA5D
                    </Typography>
                </Toolbar>
            </AppBar>
            <Card style={boxStyle}>
                <form method="post" action="/Account/Login" onSubmit={this.handleResponse} >
                    <CardMedia
                        style={mediaStyle}
                        image="/images/ada4d_logo.png"
                        title="Logo ADA4D"
                    />
                    <CardContent style={flexColumnStyle}>

                        <TextField error={this.state.error} style={inputStyle} autoFocus
                            helperText={this.state.error ? "usuario o contrase\xF1a inva\u0301lida" : ""}
                            required name="codAdministracion" label="C&oacute;digo administraci&oacute;n" type="text"
                            inputProps={{
                                maxLength: 2,
                            }}
                            variant="outlined"
                            onChange={this.handleChange} value={this.state.codAdministracion} ></TextField>

                        <TextField error={this.state.error}
                            style={inputStyle}
                            required name="username" label="Usuario" type="text" onChange={this.handleChange}
                            variant="outlined"
                            value={this.state.username} ></TextField>

                        <TextField error={this.state.error} required name="password" label="Password"
                            style={inputStyle}
                            type="password" onChange={this.handleChange}
                            variant="outlined"
                            value={this.state.password} ></TextField>

                        <TextField error={this.state.error} required name="hash" label="PIN"
                            style={inputStyle}
                            type="password" onChange={this.handleChange}
                            variant="outlined"
                            value={this.state.hash} ></TextField>
                    </CardContent>
                    <Divider />
                    <CardActions style={{ justifyContent: "center" }} >
                        <div style={{ display: "grid" }}>
                            <Button variant="contained" color="primary" type="submit" disabled={this.state.onLogin === true}>
                                {this.state.onLogin === true ? "Ingresando..." : "Ingresar"}
                            </Button>
                            <FormControlLabel 
                                control={<Switch checked={this.state.saveCredential} onChange={this.handleChangeCheckbox} name="saveCredential" color="primary" />}
                                label="Mantener sesi&oacute;n"
                            />
                        </div>                            
                    </CardActions>
                </form>
                </Card>
                </div>
        );
    }
}