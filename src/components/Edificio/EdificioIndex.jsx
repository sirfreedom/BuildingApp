import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    RangeRule,
} from 'devextreme-react/data-grid';

import { AdministracionService } from '../../services/AdministracionService';
import { EdificioService } from '../../services/EdificioService';
import { TipoIdentificadorService } from '../../services/TipoIdentificadorService';
import { ComplejoUrbanisticoService } from '../../services/ComplejoUrbanisticoService';
import { EstadoEdificioService } from '../../services/EstadoEdificioService';
import { EstadoTransferenciaService } from '../../services/EstadoTransferenciaService';
import { DireccionIndex } from '../Direccion/DireccionIndex';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EdificioIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            administraciones: [],
            tiposIdentificadores: [],
            complejosUrbanisticos: [],
            estadosEdificios: [],
            estadosTransferencias: [],
            direccion: {
                id: null,
                mostrarPopupDireccion: false,
                edificioSeleccionadoId: null,
            }
        };

        //lleno la grilla
        this.refrescar();

        //lleno las administraciones
        AdministracionService.listarAutocomplete((data) => this.setState({ administraciones: data }));

        //lleno los tipos de identificadores
        TipoIdentificadorService.listarAutocomplete((data) => this.setState({ tiposIdentificadores: data }));

        //lleno los complejosUrbanisticos
        ComplejoUrbanisticoService.listarAutocomplete((data) => this.setState({ complejosUrbanisticos: data }));

        //lleno los estadosEdificios
        EstadoEdificioService.listarAutocomplete((data) => this.setState({ estadosEdificios: data }));

        //lleno los estadosTransferencias
        EstadoTransferenciaService.listarAutocomplete((data) => this.setState({ estadosTransferencias: data }));

        this.onChangeDireccion = this.onChangeDireccion.bind(this);
        this.closePopupDireccion = this.closePopupDireccion.bind(this);
        this.confirmarDireccion = this.confirmarDireccion.bind(this);
        this.onEditingStart = this.onEditingStart.bind(this);
        this.borrarDireccion = this.borrarDireccion.bind(this);
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);   
        this.goToDepartamentos = this.goToDepartamentos.bind(this);   
    }

    refrescar() {
        EdificioService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.edificioId;
        e.data.edificioId = 0;
        EdificioService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.edificioId = id;
    }

    onRowUpdated(e) {
        EdificioService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            });
    }

    onRowRemoved(e) {
        EdificioService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            });
    }

    onChangeDireccion(e) {
        //muestro el editor de direcciones
        this.setState(
            {
                direccion: {
                    id: this.state.direccion.id,
                    edificioSeleccionadoId: e.row.data.edificioId,
                    mostrarPopupDireccion: true
                }
            });
    }

    closePopupDireccion() {
        this.setState({
            direccion: {
                id: this.state.direccion.id,
                mostrarPopupDireccion: false,
                edificioSeleccionadoId: this.state.direccion.edificioSeleccionadoId
            }
        });
    }

    confirmarDireccion(data) {
        EdificioService.modificarDireccion(this.state.direccion.edificioSeleccionadoId, data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
                this.closePopupDireccion();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); //this.refrescar();
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
                    edificioSeleccionadoId: e.key,
                    mostrarPopupDireccion: true,
                }
            });
        }
    }

    onContextMenuItems(e)
    {
        if (e.row && e.row.rowType === "data") {
            e.items = [{ text: "Ver departamentos", onItemClick: () => this.goToDepartamentos(e.row) }];
        }
    }

    goToDepartamentos(row)
    {
        this.props.history.push("/departamento", { edificioId: row.data.edificioId});
    }


    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'edificioId'}
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    onEditingStart={this.onEditingStart}
                    onContextMenuPreparing={this.onContextMenuItems}
                >
                    <Column dataField="edificioId" caption="edificioId" allowEditing={false} dataType={"number"}>
                    </Column>

                    <Column dataField="administracionId" caption="Administración" dataType={"number"}>
                        <Lookup dataSource={() => this.state.administraciones} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="codigoSasa" caption="Código Sasa" >
                        <StringLengthRule max="3" />
                    </Column>

                    <Column dataField="asciiCodigoSasa" caption="Ascii Código Sasa" >
                        <StringLengthRule max="6" />
                    </Column>

                    <Column dataField="tipoIdentificadorId" caption="Tipo Identificador" dataType={"number"} >
                        <Lookup dataSource={() => this.state.tiposIdentificadores} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="identificador" caption="Identificador" />

                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" />

                    {/* Ver que es este campo */}
                    <Column dataField="datoRegional" caption="Dato Regional" dataType={"number"} />

                    <Column dataField="estadoEdificioId" caption="Estado Edificio" dataType={"number"} >
                        <Lookup dataSource={() => this.state.estadosEdificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="estadoTransferenciaId" caption="Estado Transferencia" dataType={"number"} >
                        <Lookup dataSource={() => this.state.estadosTransferencias} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="sequencer" caption="Sequencer" dataType={"number"} />

                    <Column dataField="bloqueado" caption="Bloqueado" dataType={"boolean"} />

                    <Column dataField="usuarioQueBloquea" caption="Usuario Que Bloquea" />

                    <Column dataField="razonSocialLibroSueldo" caption="Razón Social Libro Sueldo" />
                    <Column dataField="direccionFiscalLibroSueldo" caption="Dirección Fiscal Libro Sueldo" />
                    <Column dataField="actividadLibroSueldo" caption="Actividad Libro Sueldo" />
                    <Column dataField="suterhlibroSueldo" caption="Suterh Libro Sueldo" />
                    <Column dataField="nombre" caption="Nombre" />

                    <Column dataField="complejoUrbanisticoId" caption="Complejo Urbanístico" dataType={"number"} >
                        <Lookup dataSource={() => this.state.complejosUrbanisticos} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="supTotal" caption="Sup. Total" dataType={"number"} >
                        <RangeRule min="0" />
                    </Column>

                    <Column dataField="fechaInicioAdm" caption="Fecha Inicio Adm." dataType={"date"} />
                    <Column dataField="fechaContratoSocial" caption="Fecha Contrato Social" dataType={"date"} />
                    <Column dataField="direccionId" caption="DirecciónId" dataType={"number"} allowEditing={false} visible={false} />
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