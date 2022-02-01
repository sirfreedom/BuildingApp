import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { RolSeguridadService } from '../../services/RolSeguridadService';
import { AccountService } from '../../services/AccountService';
import CustomizedSnackBars from '../../components/CustomizedSnackBars';

export class Account extends Component {
    static displayName = Account.name;

    constructor (props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            confirmPassword: '',
            usuarioId: this.props.usuarioId,
            rolId: '',
            rolesUsuarios: [],
            estadoUsuarioId: '',
            estadosUsuarios: [],
            message: '',
            variant: '',
            showMessage: false
        };

        this.handleResponse = this.handleResponse.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.returnToHome = this.returnToHome.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
        this.cambiarContrasenia = this.cambiarContrasenia.bind(this);

        //cargo los roles
        RolSeguridadService.listarAutocomplete(data => this.setState({ rolesUsuarios: data }));

        this.loadProfile();
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
 
    loadProfile() {
        AccountService.index(this.state.usuarioId,
            response => response.json()
                .then(data => {
                    this.setState({
                        userName: data.userName,
                        password: data.password,
                        confirmPassword: data.password,
                        rolId: data.rolId,
                        estadoUsuarioId: data.estadoUsuarioId,
                    });
                })
        );
    }

    returnToHome() {
        this.props.history.push("/");
    }

    mostrarMensaje(message, variant) {
        this.setState({ message: message, variant: variant, showMessage: true });
    }

    cambiarContrasenia() {
        const data = {
            usuarioId: this.state.usuarioId,
            userName: this.state.userName,
            password: this.state.password,
        };

        AccountService.cambiarContrasenia(data,
            () => this.mostrarMensaje("Los cambios se guardaron correctamente", "success"),
            err => this.mostrarMensaje("Ocurrió un error. Por favor intente nuevamente", "error"));
    }

    handleResponse(e) {
        //cancelo el submit del form
        e.preventDefault();

        //valido los passwords
        if (this.state.password !== this.state.confirmPassword) {
            this.mostrarMensaje("Las contrase\u00f1as deben ser iguales", "error");
            return;
        }
        this.cambiarContrasenia();
    }

    render() {
      return (
        <form onSubmit={this.handleResponse}>
        <h3>Mi perfil</h3>
            <TextField inputProps={{
                readOnly: true,
            }} name="userName" margin="normal" label="usuario" type="text" value={this.state.userName} onChange={this.handleChange} />
            <TextField required name="password" margin="normal" label="contrase&ntilde;a" type="password" value={this.state.password} onChange={this.handleChange} />
            <TextField required name="confirmPassword" margin="normal" label="confirmar contrase&ntilde;a" type="password" value={this.state.confirmPassword} onChange={this.handleChange} />
            <TextField select label="rol" name="rolId" value={this.state.rolId} margin="normal" onChange={this.handleChange} required>
                <MenuItem value=""><em>Ninguno</em></MenuItem>
                {
                    this.state.rolesUsuarios.map(rol => {
                        return <MenuItem key={rol.id} value={rol.id}>{rol.descripcion}</MenuItem>
                    })
                }
            </TextField>
            <div>
                <Button type="submit" color="primary">Guardar</Button>
                <Button type="button" onClick={this.returnToHome}>Cancelar</Button>
            </div>
            <CustomizedSnackBars open={this.state.showMessage} onClose={() => this.setState({ showMessage: false})} variant={this.state.variant} message={this.state.message} ></CustomizedSnackBars> 
        </form>
    );
  }
}