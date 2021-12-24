import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    CustomRule
} from 'devextreme-react/data-grid';

import { ConmutadorAdministradorService } from '../../services/ConmutadorAdministradorService';
import { ImageUploader } from '../Helper/ImageUploader';
import { ArchivoAdjuntoService } from '../../services/ArchivoAdjuntoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import ValidacionCuit from '../../utils/ValidacionCuit';
import ValidacionEmail from '../../utils/ValidacionEmail';

export class ConmutadorAdministrador extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            situacionesFiscales: []
        };

        //lleno la grilla
        this.refrescar();

        //lleno las situacionesFiscales
        ConmutadorAdministradorService.listarSituacionFiscal((data) => this.setState({ situacionesFiscales: data }));

        //Binds
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorAdministradorService.listar(data => this.setState({ items: data }));
    }

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "data" && e.column.allowEditing !== false) {
            e.items = [{ text: "Copiar a todos", onItemClick: () => this.copiarATodos(e) }];
        }
    }

    copiarATodos(e) {
        const grid = e.component;
        const propName = e.column.dataField;
        const value = e.row.data[propName];
        let items = grid.option("dataSource");

        //activo el spinner de loading
        grid.beginCustomLoading();

        if (propName === "imagenFirma" || propName === "imagenLogo") {
            //recupero la imagen
            ArchivoAdjuntoService.obtenerJson(data => {
                //mantengo el id y copio el mimeType y el base64 de la imagen
                for (var i = 0; i < items.length; i++) {
                    items[i][propName] = { ...items[i][propName], ...data };
                }

                this.modificarBatch(items, grid);

            }, value.archivoAdjuntoId);
        }
        else {
            //copio el valor a todos los items
            for (var i = 0; i < items.length; i++) {
                items[i][propName] = value;
            }

            this.modificarBatch(items, grid);
        }
    }

    onRowUpdated(e) {
        
        ConmutadorAdministradorService.modificar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
            }
        );
    }

    modificarBatch(data, grid) {
        ConmutadorAdministradorService.modificarBatch(data,
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

    onFirmaUpload(rowData, base64, mimeType) {
        //lleno el campo firma
        rowData.setValue({ mimeType: mimeType, base64: base64} , "imagenFirma");
    }

    onLogoUpload(rowData, base64, mimeType) {
        //lleno el campo logo
        rowData.setValue({ mimeType: mimeType, base64: base64 }, "imagenLogo");
    }

    firmaEditRender(e) {
        return <ImageUploader accept={".jpeg,.jpg,.png,.gif"} rowData={e} mimeType={e.data.imagenFirma.mimeType} base64={e.data.imagenFirma.base64} onUploadComplete={this.onFirmaUpload} />
    };

    logoEditRender(e) {
        return <ImageUploader accept={".jpeg,.jpg,.png,.gif"} rowData={e} mimeType={e.data.imagenLogo.mimeType} base64={e.data.imagenLogo.base64} onUploadComplete={this.onLogoUpload} />
    };

    render() {
        return (
            <Fragment>
                <ADAGrid
                    width={"100%"}
                    items={this.state.items}
                    keyExpr={['edificioId', 'liquidacionId']}
                    onRowUpdated={this.onRowUpdated}
                    allowAdding={false}
                    allowDeleting={false}
                    editingMode={"cell"}
                    onContextMenuPreparing={this.onContextMenuItems}
                >
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" fixed={true} cssClass={"columnaFija"} fixedPosition="left" allowEditing={false}>
                    </Column>

                    <Column dataField="direccionFormateada" caption="Edificio" fixed={true} cssClass={"columnaFija"} fixedPosition="left" allowEditing={false} />

                    <Column dataField="nombre" caption="Nombre" >
                        <RequiredRule />
                        <StringLengthRule max="200" />
                    </Column>

                    <Column dataField="direccion" caption="Dirección" >
                        <RequiredRule />
                        <StringLengthRule max="200" />
                    </Column>

                    <Column dataField="telefono" caption="Teléfono" >
                        <RequiredRule />
                        <StringLengthRule max="100" />
                    </Column>

                    <Column dataField="email" caption="Email" >
                        <RequiredRule />
                        <StringLengthRule max="100" />
                        <CustomRule validationCallback={this.onChangeEmail} dataField="email" message="Email inválido!!!" />
                    </Column>

                    <Column dataField="cuit" caption="Cuit" editorOptions={{ mask: "00-99999999-0" }}
                        showEditorAlways={false}> 
                        <RequiredRule />
                        <CustomRule validationCallback={this.onChangeCuit} dataField="cuit" message="Cuit inválido!!!" />
                    </Column>

                    <Column dataField="rpa" caption="Rpa" >
                        <RequiredRule />
                        <StringLengthRule max="20" />
                    </Column>

                    <Column dataField="situacionFiscalId" caption="Situación Fiscal" dataType={"number"}>
                        <Lookup dataSource={this.state.situacionesFiscales} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="imagenFirma" caption="Firma" showEditorAlways={true} editCellRender={this.firmaEditRender.bind(this)} >    
                    </Column>

                    <Column dataField="imagenLogo" caption="Logo" showEditorAlways={true} editCellRender={this.logoEditRender.bind(this)} >
                    </Column>
                </ADAGrid>
            </Fragment>
        );
    }
}