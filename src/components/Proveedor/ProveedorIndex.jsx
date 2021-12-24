import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    CustomRule
} from 'devextreme-react/data-grid';

import { ProveedorService } from '../../services/ProveedorService';
import { EstadoProveedorService } from '../../services/EstadoProveedorService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import ValidacionCuit from '../../utils/ValidacionCuit';
import ValidacionEmail from '../../utils/ValidacionEmail';

export class ProveedorIndex extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            situacionesFiscales: [],
            estadosProveedores:[]
        };

        //lleno la grilla
        this.refrescar();

        //lleno las situacionesFiscales
        ProveedorService.listarSituacionFiscal((data) => this.setState({ situacionesFiscales: data }));

        //lleno los estadosProveedores
        EstadoProveedorService.listarAutocomplete((data) => this.setState({ estadosProveedores: data }));

        //Binds
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ProveedorService.listar(data => this.setState({ items: data }));
    }

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "data" && e.column.allowEditing !== false) {
            e.items = [{ text: "Más info", onItemClick: () => this.masInfo(e) }];
        }
    }

    masInfo(e) {

    }

    onRowUpdated(e) {
        
        ProveedorService.modificar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
            }
        );
    }

    modificarBatch(data, grid) {
        ProveedorService.modificarBatch(data,
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

    onChangeCuit(e) {

        if (e.rule.dataField !== "cuit") return true;

        let cuit = e.value;
        return ValidacionCuit(cuit);
    }

    onChangeEmail(e) {

        if (e.rule.dataField !== "email") return true;

        let email = e.value;
        return ValidacionEmail(email);
    }

    render() {
        return (
            <Fragment>
                <ADAGrid
                    width={"100%"}
                    items={this.state.items}
                    keyExpr={'proveedorId'}
                    onRowUpdated={this.onRowUpdated}
                    allowAdding={false}
                    allowDeleting={false}
                    editingMode={"cell"}
                    onContextMenuPreparing={this.onContextMenuItems}
                >
                    <Column dataField="nombre" caption="Nombre" >
                        <RequiredRule />
                        <StringLengthRule max="200" />
                    </Column>

                    <Column dataField="cuit" caption="Cuit" editorOptions={{ mask: "00-99999999-0" }}
                        showEditorAlways={false}>
                        <RequiredRule />
                        <CustomRule validationCallback={this.onChangeCuit} dataField="cuit" message="Cuit inválido!!!" />
                    </Column>



                    <Column dataField="direccion" caption="Dirección" allowEditing={false} >
                    </Column>

                    <Column dataField="emails" caption="Emails" allowEditing={false}>
                    </Column>

                    <Column dataField="telefonos" caption="Teléfonos" allowEditing={false}>
                    </Column>

                    <Column dataField="datosBancarios" caption="Datos Bancarios" allowEditing={false}>
                    </Column>

                    <Column dataField="situacionFiscalId" caption="Situación Fiscal" dataType={"number"}>
                        <Lookup dataSource={this.state.situacionesFiscales} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="matricula" caption="Matrícula">
                        <RequiredRule />
                    </Column>

                    <Column dataField="observaciones" caption="Situación Fiscal" >
                        <Lookup dataSource={this.state.situacionesFiscales} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="estadoProveedorId" caption="Estado" dataType={"number"}>
                        <Lookup dataSource={this.state.estadosProveedores} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    
                </ADAGrid>
            </Fragment>
        );
    }
}