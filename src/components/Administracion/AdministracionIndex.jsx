import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule
} from 'devextreme-react/data-grid';

import { AdministracionService } from '../../services/AdministracionService';
import { ClienteSasaService } from '../../services/ClienteSasaService';
import { EstadoAdministracionService } from '../../services/EstadoAdministracionService';
import { TipoIdentificadorService } from '../../services/TipoIdentificadorService';
import { DireccionIndex } from '../Direccion/DireccionIndex';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class AdministracionIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            clientesSasa: [],
            estadosAdministracion: [],
            tiposIdentificadores: [],
            direccion: {
                id: null,
                mostrarPopupDireccion: false,
                administracionSeleccionadaId: null,
            }
        };

        //lleno la grilla
        this.refrescar();

        //lleno los clientes
        ClienteSasaService.listarAutocomplete((data) => this.setState({ clientesSasa: data }));

        //lleno los estados administracion
        EstadoAdministracionService.listarAutocomplete((data) => this.setState({ estadosAdministracion: data }));

        //lleno los tipos de identificadores
        TipoIdentificadorService.listarAutocomplete((data) => this.setState({ tiposIdentificadores: data }));

        //funciones para direccion
        this.onChangeDireccion = this.onChangeDireccion.bind(this);
        this.closePopupDireccion = this.closePopupDireccion.bind(this);
        this.confirmarDireccion = this.confirmarDireccion.bind(this);
        this.onEditingStart = this.onEditingStart.bind(this);
        this.borrarDireccion = this.borrarDireccion.bind(this);

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        AdministracionService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.administracionId;
        e.data.administracionId = 0;
        AdministracionService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.administracionId = id;
    }

    onRowUpdated(e) {
        AdministracionService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        AdministracionService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onChangeDireccion(e) {
        //muestro el editor de direcciones
        this.setState(
            {
                direccion: {
                    id: this.state.direccion.id,
                    administracionSeleccionadaId: e.row.data.administracionId,
                    mostrarPopupDireccion: true
                }
            });
    }

    closePopupDireccion() {
        this.setState({
            direccion: {
                id: this.state.direccion.id,
                mostrarPopupDireccion: false,
                administracionSeleccionadaId: this.state.direccion.administracionSeleccionadaId
            }
        });
    }

    confirmarDireccion(data) {
        
        AdministracionService.modificarDireccion(this.state.direccion.administracionSeleccionadaId, data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
                this.closePopupDireccion();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            });
    }

    borrarDireccion() {
        Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
        this.refrescar();
    }

    onEditingStart(e) {
        if (e.column.dataField === "direccion.direccionFormateada") {
            e.cancel = true;
            if (e.key == null) {
                Notifier.mostrarNotificacion("Debe confirmar los cambios antes de cargar la dirección", "warning", 3000);
                return;
            }

            this.setState({
                direccion: {
                    id: e.data.direccionId,
                    administracionSeleccionadaId: e.key,
                    mostrarPopupDireccion: true,
                }
            });
        }
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'administracionId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    onEditingStart={this.onEditingStart} 
                >
                 
                    <Column dataField="administracionId" caption="administracionId" allowEditing={false} dataType={"number"}>
                    </Column>
                    <Column dataField="clienteSasaid" caption="clienteSasaid" dataType={"number"}>
                        <Lookup dataSource={() => this.state.clientesSasa} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="smtpHost" caption="Host Smtp" />
                    <Column dataField="smtpPort" caption="Puerto Smtp" dataType={"number"} />
                    <Column dataField="smtpUsername" caption="Usuario Smtp" />
                    <Column dataField="smtpPassword" caption="Contraseña Smtp" />
                    <Column dataField="smtpSsl" caption="Ssl" dataType="boolean" />
                    <Column dataField="emailAdministracion" caption="Email" />
                    <Column dataField="estadoAdministracionId" caption="Estado Administración" dataType={"number"} >
                        <Lookup dataSource={() => this.state.estadosAdministracion} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    <Column dataField="tipoIdentificadorId" caption="Tipo Identificador" dataType={"number"} >
                        <Lookup dataSource={() => this.state.tiposIdentificadores} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    <Column dataField="identificador" caption="Identificador" />

                    <Column dataField="direccion.direccionFormateada" caption="Dirección" allowEditing={true} />
                </ADAGrid>

                {this.state.direccion.mostrarPopupDireccion ?
                    <DireccionIndex direccionId={this.state.direccion.id} closePopupDireccion={this.closePopupDireccion} confirmarDireccion={this.confirmarDireccion} borrarDireccion={this.borrarDireccion} />
                    : null
                }
            </div>
        );
    }
}