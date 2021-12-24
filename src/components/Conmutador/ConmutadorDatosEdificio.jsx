import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    RangeRule,
    CustomRule
} from 'devextreme-react/data-grid';

import { AdministracionService } from '../../services/AdministracionService';
import { EdificioService } from '../../services/EdificioService';
import { TipoIdentificadorService } from '../../services/TipoIdentificadorService';
import { ComplejoUrbanisticoService } from '../../services/ComplejoUrbanisticoService';
import { UsuarioService } from '../../services/UsuarioService';
import { EstadoEdificioService } from '../../services/EstadoEdificioService';
import { EstadoTransferenciaService } from '../../services/EstadoTransferenciaService';
import { DireccionIndex } from '../Direccion/DireccionIndex';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import ValidacionCuit from '../../utils/ValidacionCuit';
import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorDatosEdificio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            administraciones: [],
            tiposIdentificadores: [],
            complejosUrbanisticos: [],
            estadosEdificios: [],
            estadosTransferencias: [],
            usuarios: [],
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

        UsuarioService.listarAutocomplete((data) => this.setState({ usuarios: data }));

        this.onChangeDireccion = this.onChangeDireccion.bind(this);
        this.closePopupDireccion = this.closePopupDireccion.bind(this);
        this.confirmarDireccion = this.confirmarDireccion.bind(this);
        this.onEditingStart = this.onEditingStart.bind(this);
        this.borrarDireccion = this.borrarDireccion.bind(this);
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);

        this.onChangeCodigoReemplazo = this.onChangeCodigoReemplazo.bind(this);
        this.onChangeCuit = this.onChangeCuit.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.goToDepartamentos = this.goToDepartamentos.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
        
        this.esCampoCuit = this.esCampoCuit.bind(this);
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
                // this.refrescar();
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

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "data") {
            e.items = [{ text: "Ver departamentos", onItemClick: () => this.goToDepartamentos(e.row) }];

            if (e.column.allowEditing !== false && !this.esCampoCodigoReemplazo(e.column.dataField)) {
                e.items.push({ text: "Copiar a todos", onItemClick: () => this.copiarATodos(e) })
            }
        }
    }

    goToDepartamentos(row) {
        this.props.history.push("/departamento", { edificioId: row.data.edificioId });
    }

    copiarATodos(e) {
        menuCopiarATodos( e , (items) => {
            let resultado = true;

            if (this.esCampoCuit(e.column.dataField)){
                resultado = ValidacionCuit(e.row.data.identificador)
            }
            
            return resultado;
        }, this.modificarBatch )
    }

    modificarBatch(data, grid) {
        grid.beginCustomLoading();

        EdificioService.modificarBatch(data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            }
        );
    }

    esCampoCodigoReemplazo(dataField) {
        return (dataField === "codigoReemplazo")
    }

    esCampoCuit(dataField) {
        return (dataField === "identificador")
    }

    onChangeCodigoReemplazo(e) {
        if (!this.esCampoCodigoReemplazo(e.rule.dataField)) return true;
        // if (e.rule.dataField !== "codigoReemplazo") return true;
        //1.No este repetido entre los codigosReemplazo de mi estado 
        const index = this.state.items.findIndex((edificio) => {
            return (edificio.codigoReemplazo === e.value) && (edificio.edificioId !== e.data.edificioId);
        })

        if (index !== -1) {
            return false;
        }

        //2.Recien ahi validar contra la API por todos los edificios de la admin
        // se hace en el momento de guardar.
        return true;
    }

    onChangeCuit(e) {

        if (e.rule.dataField !== "identificador") return true;

        let cuit = e.value;

        return ValidacionCuit(cuit);
    }

    render() {
        return (
            <Fragment>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'edificioId'}
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    onEditingStart={this.onEditingStart}
                    onContextMenuPreparing={this.onContextMenuItems}
                    allowAdding={false}
                    allowDeleting={false}
                    width={"100%"}
                    editingMode={"cell"}
                >

                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" fixed={true} fixedPosition="left" >
                        <RequiredRule />
                        <StringLengthRule max="5" min={"3"} />
                        <CustomRule validationCallback={this.onChangeCodigoReemplazo} dataField="codigoReemplazo" message="Codigo invalido!!!" />
                    </Column>

                    <Column dataField="codigoSasa" caption="Código Sasa" allowEditing={false} fixed={true} fixedPosition="left"  >
                        <StringLengthRule max="3" />
                    </Column>

                    <Column dataField="tipoIdentificadorId" caption="Tipo Identificador" dataType={"number"} fixed={true} fixedPosition="left" >
                        <Lookup dataSource={() => this.state.tiposIdentificadores} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="identificador" caption="Identificador" fixed={true} fixedPosition="left"
                        editorOptions={{ mask: "00-99999999-0" }}
                        showEditorAlways={false}>
                        <CustomRule validationCallback={this.onChangeCuit} dataField="identificador" message="Cuit invalido!!!" />
                    </Column>

                    <Column dataField="direccion.direccionFormateada" caption="Dirección" allowEditing={true} fixed={true} fixedPosition="left" />

                    <Column dataField="nombre" caption="Nombre" />

                    <Column dataField="estadoTransferenciaId" caption="Estado Transferencia" dataType={"number"} allowEditing={false}>
                        <Lookup dataSource={() => this.state.estadosTransferencias} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    {/* Ver que es este campo */}
                    {/* <Column dataField="datoRegional" caption="Dato Regional" dataType={"number"} /> */}

                    <Column dataField="direccion.codigoPostal" caption="Codigo Postal" allowEditing={true} >
                    </Column>

                    <Column dataField="direccion.provincia" caption="Provincia" allowEditing={true} >
                    </Column>

                    <Column dataField="direccion.localidad" caption="Localidad" allowEditing={true} >
                    </Column>

                    <Column dataField="estadoEdificioId" caption="Estado Edificio" dataType={"number"} allowEditing={false}>
                        <Lookup dataSource={() => this.state.estadosEdificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="suterhlibroSueldo" caption="Suterh Libro Sueldo" allowEditing={true} />

                    <Column dataField="sequencer" caption="Sequencer" dataType={"number"} allowEditing={true} />

                    <Column dataField="bloqueado" caption="Bloqueado" dataType={"boolean"} allowEditing={true} trueText={"Si"} falseText={"No"} showEditorAlways={false} />
                    <Column dataField="usuarioQueBloquea" caption="Usuario Que Bloquea" dataType={"number"} allowEditing={false}>
                        <Lookup dataSource={() => this.state.usuarios} valueExpr={'id'} displayExpr={'descripcion'} />
                    </Column>

                    <Column dataField="complejoUrbanisticoId" caption="Complejo Urbanístico" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.complejosUrbanisticos} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="supTotal" caption="Sup. Total" dataType={"number"} allowEditing={true}>
                        <RangeRule min="0" />
                    </Column>

                    <Column dataField="fechaInicioAdm" caption="Fecha Inicio Adm." dataType={"date"} allowEditing={true} />
                </ADAGrid>

                {this.state.direccion.mostrarPopupDireccion ?
                    <DireccionIndex direccionId={this.state.direccion.id} closePopupDireccion={this.closePopupDireccion} confirmarDireccion={this.confirmarDireccion} borrarDireccion={this.borrarDireccion} />
                    : null
                }

            </Fragment>
        );
    }
}