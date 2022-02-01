import React from 'react';

import {
    Column,
    RequiredRule,
    StringLengthRule
} from 'devextreme-react/data-grid';

import { ClienteSasaService } from '../../services/ClienteSasaService';
import { DireccionIndex } from '../Direccion/DireccionIndex';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class ClienteSasaIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            direccion: {
                id: null,
                mostrarPopupDireccion: false,
                clienteSasaSeleccionadoId: null,
            },
        };

        //lleno la grilla
        this.refrescar();

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
        ClienteSasaService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.clienteSasaid;
        e.data.clienteSasaid = 0;
        ClienteSasaService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.clienteSasaid = id;
    }

    onRowUpdated(e) {
        ClienteSasaService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        ClienteSasaService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onChangeDireccion(e) {
        //muestro el editor de direcciones
        this.setState(
            {
                direccion: {
                    id: this.state.direccion.id,
                    clienteSasaSeleccionadoId: e.row.data.clienteSasaid,
                    mostrarPopupDireccion: true
                }
            });

    }

    closePopupDireccion() {
        this.setState({
            direccion: {
                id: this.state.direccion.id,
                mostrarPopupDireccion: false,
                clienteSasaSeleccionadoId: this.state.direccion.clienteSasaSeleccionadoId
            }
        });
    }

    confirmarDireccion(data) {
        ClienteSasaService.modificarDireccion(this.state.direccion.clienteSasaSeleccionadoId, data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
                this.closePopupDireccion();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); //this.refrescar();
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
                    clienteSasaSeleccionadoId: e.key,
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
                    keyExpr={'clienteSasaid'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    onEditingStart={this.onEditingStart} 
                >
                 
                    <Column dataField="clienteSasaid" defaultSortOrder="desc" caption="ClienteSasaid" allowEditing={false} dataType={"number"} >
                    </Column>
                    <Column dataField="nombre" caption="Nombre" >
                        <RequiredRule />
                    </Column>
                    <Column dataField="codAdministracion" caption="Código administración" >
                        <RequiredRule />
                        <StringLengthRule max="2" />
                    </Column>
                    <Column dataField="asciiCodAdministracion" caption="Ascii administración" >
                        <RequiredRule />
                        <StringLengthRule max="4" />
                    </Column>

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