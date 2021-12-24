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
                direccionFormateada: ""
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
        var data = { ...this.state.data, ...{ [name]: value } };
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
        var calle = this.parseAddressComponent(places, "route");
        var numero = this.parseAddressComponent(places, "street_number");
        var codigoPostal = this.parseAddressComponent(places, "postal_code_suffix") + this.parseAddressComponent(places, "postal_code");
        var lat = this.parseLatitude(places);
        var long = this.parseLongitude(places);
        var pais = this.parseAddressComponent(places, "country");
        var provincia = this.parseAddressComponent(places, "administrative_area_level_1");
        var localidad = this.parseAddressComponent(places, "locality");
        var direccionFormateada = this.parseFormattedAddress(places);
        
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
                    direccionFormateada: direccionFormateada,
                }
        });
    }

    parseAddressComponent(places, type) {
        var result = "";
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
        var result = "";
        try {
            result = places[0].geometry.location.lat();
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    parseLongitude(places) {
        var result = "";
        try {
            result = places[0].geometry.location.lng();
        } catch (e) {
            //no interesa si no puedo parsearlo
        }

        return result;
    }

    parseFormattedAddress(places) {
        var result = "";
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
                className={'popup'}
                visible={this.state.popupVisible}
                onHiding={this.closePopup}
                onHidden={this.props.closePopupDireccion}
                dragEnabled={true}
                closeOnOutsideClick={false}
                showTitle={true}
                title={'Buscador de Direcciones'}
                height={"480px"}
            >
                <form onSubmit={this.handleResponse}>
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
                        <TextField style={inputs} name="direccionFormateada" margin="normal" label="DireccionFormateada" type="text" value={this.state.data.direccionFormateada || ""} onChange={this.handleChange} inputProps={{
                            readOnly: true,
                        }} />

                        <hr/>
                        <div style={{ textAlign: "right" }}>
                            <Button type="submit" color="primary">Guardar</Button>
                            {this.state.data.direccionId !== 0 ?
                                <Button type="button" color="secondary" onClick={this.borrarDireccion}>Borrar</Button>    
                                : null
                            }
                            <Button type="button" onClick={this.closePopup}>Cancelar</Button>
                        </div>
                    </fieldset>
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