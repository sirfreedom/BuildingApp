import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DireccionSearchBox } from './DireccionSearchBox';
import { Popup } from 'devextreme-react/popup';
import { DireccionService } from '../../services/DireccionService';

export class DireccionIndex extends Component {
    static displayName = DireccionIndex.name;

    constructor(props) {
        super(props);
        this.state = {
            data: {
                direccionId: this.props.direccionId || 0,
                calle: "",
                numero: "",
                piso: "",
                departamento: "",
                codigoPostal: "",
                lat: "",
                long: "",
                pais: "",
                provincia: "",
                localidad: "",
                direccionFormateada: "",
                direccionApiGoogle: ""
            },
            showMessage: false,
            popupVisible: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSearchComplete = this.onSearchComplete.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.confirmarDireccion = this.confirmarDireccion.bind(this);
        this.cargarDireccion = this.cargarDireccion.bind(this);
        this.borrarDireccion = this.borrarDireccion.bind(this);
        this.handleResponse = this.handleResponse.bind(this);

        this.cargarDireccion(this.props.direccionId);
    }
    
    cargarDireccion(direccionId) {
        if (direccionId != null) {
            DireccionService.buscar(direccionId, data => this.setState({ data: data }));
        }
    }

    handleChange(e) {
        const { name, value } = e.target;

        //devuelvo el state original y solo le piso el nuevo valor
        let data = { ...this.state.data, ...{ [name]: value } };
        this.setState({ data: data });
    }

    handleResponse(e) {
        //cancelo el submit del form
        e.preventDefault();
        this.confirmarDireccion();
    }

    mostrarMensaje(message, variant) {
        this.setState({ message: message, variant: variant, showMessage: true });
    }

    onSearchComplete(places) {
        let calle = this.parseAddressComponent(places, "route");
        let numero = this.parseAddressComponent(places, "street_number");
        let codigoPostal = this.parseAddressComponent(places, "postal_code_suffix") + this.parseAddressComponent(places, "postal_code");
        let lat = this.parseLatitude(places);
        let long = this.parseLongitude(places);
        let pais = this.parseAddressComponent(places, "country");
        let provincia = this.parseAddressComponent(places, "administrative_area_level_1");
        let localidad = this.parseAddressComponent(places, "locality");
        let direccionApiGoogle = this.parseFormattedAddress(places);

        this.setState({
            data: {
                    direccionId: this.state.data.direccionId,
                    calle: calle,
                    numero: numero,
                    piso: this.state.data.piso,
                    departamento: this.state.data.departamento,
                    codigoPostal: codigoPostal,
                    lat: lat,
                    long: long,
                    pais: pais,
                    provincia: provincia,
                    localidad: localidad,
                    direccionFormateada: this.state.data.direccionFormateada,
                    direccionApiGoogle: direccionApiGoogle
                }
        });
    }

    parseAddressComponent(places, type) {
        let result = "";
        try {
            //busco por igual
            var data = places[0].address_components.filter(data => data.types.find(t => t === type) !== undefined);

            //sino lo encontre, hago un like
            if (data.length === 0)
                data = places[0].address_components.filter(data => data.types.find(t => t.indexOf(type.substring(0, type.length - 1)) !== -1));

            result = data[0].long_name;
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    parseLatitude(places) {
        let result = "";
        try {
            result = places[0].geometry.location.lat();
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    parseLongitude(places) {
        let result = "";
        try {
            result = places[0].geometry.location.lng();
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    parseFormattedAddress(places) {
        let result = "";
        try {
            result = places[0].formatted_address;
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    closePopup() {
        this.setState({ popupVisible: false });
    }

    borrarDireccion() {
        DireccionService.borrar(this.state.data,
            () => {
                this.props.borrarDireccion();
                this.closePopup();
            },
            () => this.closePopup());
    }

    confirmarDireccion() {
        this.props.confirmarDireccion(this.state.data);
    }

    render() {
        const inputs = {
            width: "25%",
            paddingRight: "5px"
        }

        return (
            <Popup
                deferRendering={true}
                className={'popup'}
                visible={this.state.popupVisible}
                onHiding={this.closePopup}
                onHidden={this.props.closePopupDireccion}
                dragEnabled={true}
                closeOnOutsideClick={false}
                showTitle={true}
                title={'Buscador de Direcciones'}
                height={"440px"}
            >
                <form onSubmit={this.handleResponse} style={{display: "flex", flexDirection: "column", height: "inherit"}}>
                    <fieldset style={{
                            overflowY: "auto",
                            height: "inherit"
                        }}>
                        <div style={{ textAlign: "center" }} >
                            <DireccionSearchBox onPlacesChanged={this.onSearchComplete} />
                        </div>

                        <TextField style={inputs} required={true} name="calle" margin="normal" label="Calle" type="text" value={this.state.data.calle || ""} onChange={this.handleChange} />
                        <TextField style={inputs} required={true} name="numero" margin="normal" label="Número" type="text" value={this.state.data.numero || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="piso" margin="normal" label="Piso" type="text" value={this.state.data.piso || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="departamento" margin="normal" label="Departamento" type="text" value={this.state.data.departamento || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="codigoPostal" margin="normal" label="Código Postal" type="text" value={this.state.data.codigoPostal || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="lat" margin="normal" label="Latitud" type="text" value={this.state.data.lat || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="long" margin="normal" label="Longitud" type="text" value={this.state.data.long || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="pais" margin="normal" label="Pais" type="text" value={this.state.data.pais || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="provincia" margin="normal" label="Provincia" type="text" value={this.state.data.provincia || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="localidad" margin="normal" label="Localidad" type="text" value={this.state.data.localidad || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="direccionFormateada" margin="normal" label="dirección" type="text" value={this.state.data.direccionFormateada || ""} onChange={this.handleChange} />
                        <TextField style={inputs} name="direccionApiGoogle" margin="normal" label="Dirección ApiGoogle" type="text" value={this.state.data.direccionApiGoogle || ""} onChange={this.handleChange} inputProps={{
                            readOnly: true,
                            style: {cursor: "not-allowed"}
                        }} />
                    </fieldset>
                    <hr />
                    <div style={{ textAlign: "right" }}>
                        <Button type="submit" color="primary">Guardar</Button>
                        {this.state.data.direccionId !== 0 ?
                            <Button type="button" color="secondary" onClick={this.borrarDireccion}>Borrar</Button>
                            : null
                        }
                        <Button type="button" onClick={this.closePopup}>Cancelar</Button>
                    </div>
                </form>
            </Popup>
        );
    }
}

DireccionIndex.propTypes = {
    direccionId: PropTypes.number,
    closePopupDireccion: PropTypes.func.isRequired,
    confirmarDireccion: PropTypes.func.isRequired,
    borrarDireccion: PropTypes.func.isRequired
};