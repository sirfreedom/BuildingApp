import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    RangeRule,
    MasterDetail,
    CustomRule,
    Summary,
    GroupItem,
    ValueFormat,
    TotalItem
} from 'devextreme-react/data-grid';

import { PreCargaGastoService } from '../../services/PreCargaGastoService';
import { EdificioService } from '../../services/EdificioService';
import ADAGrid from '../Grid/ADAGrid';
import { PreCargaGastoImporte } from './PreCargaGastoImporte';
import { Notifier } from '../Grid/Notifier';

export class PreCargaGastoIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            mostrarSoloMisExpensas: true,
            incluirImportados: false,
            modoBorrador: false,
            items: []
        };

        //saco los datasource afuera del state para que no refresque tantas veces
        this.dataSources = {
            edificios: [],
            agrupamientos: [],
            agrupamientosFiltrados: [],
            proveedores: [],
            tiposDePago: [],
            tiposDePagoPorEdificio: [],
            textosPregrabados: [],
            gastos:[],
            edificioSeleccionadoId: null
        };

        //lleno la grilla
        this.refrescar();

        //lleno los edificios
        EdificioService.listarAutocomplete((data) => { this.dataSources.edificios = data; this.checkIsLoaded(); });

        //lleno los agrupamientos
        PreCargaGastoService.listarAgrupamientos((data) => {
            this.dataSources.agrupamientos = data;
            this.dataSources.agrupamientosFiltrados = data.filter((val, index) => val.esMisExpensas);
            this.checkIsLoaded();
        });

        //lleno los proveedores
        PreCargaGastoService.listarProveedores((data) => { this.dataSources.proveedores = data; this.checkIsLoaded(); });

        //lleno los tiposDePago
        PreCargaGastoService.listarTiposDePagos((data) => { this.dataSources.tiposDePago = data; this.checkIsLoaded(); });        

        //lleno los tiposDePagoPorEdificio
        PreCargaGastoService.listarTiposDePagosPorEdificio((data) => { this.dataSources.tiposDePagoPorEdificio = data; this.checkIsLoaded(); });        

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
        this.validarFechaPago = this.validarFechaPago.bind(this);        

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);  

        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);  
        this.listoParaEnviarAda4 = this.listoParaEnviarAda4.bind(this);
        this.tituloSubGrilla = this.tituloSubGrilla.bind(this);        
        this.renderSubGrilla = this.renderSubGrilla.bind(this);        
        this.mostrarSoloMisExpensasClick = this.mostrarSoloMisExpensasClick.bind(this);       
        this.duplicateRow = this.duplicateRow.bind(this);       
        this.onEditorPreparing = this.onEditorPreparing.bind(this);           
        this.checkIsLoaded = this.checkIsLoaded.bind(this);
        this.onInitNewRow = this.onInitNewRow.bind(this);        
        this.incluirImportadosClick = this.incluirImportadosClick.bind(this);        
        this.modoBorradorClick = this.modoBorradorClick.bind(this);        
    }

    //luego de cargar todos los autocompletes, lo seteo como isLoaded:true
    checkIsLoaded() {
        if (this.dataSources.agrupamientos.length !== 0
            && this.dataSources.edificios.length !== 0
            && this.dataSources.proveedores.length !== 0
            && this.dataSources.tiposDePago.length !== 0
            && this.dataSources.tiposDePagoPorEdificio.length !== 0) {
                this.setState({ isLoaded: true });
        }                
    }

    refrescar() {
        PreCargaGastoService.listar(data => {
            //guardo todos los gastos
            this.dataSources.gastos = data;
            let filterData = data;

            //por default no muestro los importados
            if(this.state.incluirImportados === false)
                filterData = data.filter(x => x.listoParaImportarAda4 === false);

            this.setState({ items: filterData });
        });
    }

    tituloSubGrilla(e) {
        return this.dataSources.edificios.find(x => x.id === e).descripcion;
    }

    listoParaEnviarAda4(grid) {
        
        //solo los visibles en la grilla
        var data = grid.component.getVisibleRows().map((elem) => elem.data.preCargaGastoId);

        if (data.length === 0)
            return;

        PreCargaGastoService.listoParaEnviarAda4(
            data,
            (resp) => { Notifier.mostrarNotificacion("Todos los gastos se importarán automáticamente dentro de los próximos 10 minutos.", "success", 10000); this.refrescar(); },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 10000); this.refrescar();
            });
    }

    mostrarSoloMisExpensasClick(e) {
        var soloMisExpensas = e.value;
        var agrupamientosFiltrados = this.dataSources.agrupamientos.filter((val, index) => soloMisExpensas === false || (soloMisExpensas === true && val.esMisExpensas));

        this.dataSources.agrupamientosFiltrados = agrupamientosFiltrados;

        this.setState({
            mostrarSoloMisExpensas: soloMisExpensas
        });
    }

    incluirImportadosClick(e) {
        var incluirImportadosChecked = e.value;
        
        if (incluirImportadosChecked)
            this.setState({ items: this.dataSources.gastos, incluirImportados: incluirImportadosChecked });
        else {
            let filterData = this.dataSources.gastos.filter(x => x.listoParaImportarAda4 === false);
            this.setState({ items: filterData, incluirImportados: incluirImportadosChecked });
        }
    }    

    modoBorradorClick(e, grid) {
        this.setState({ modoBorrador: e.value });

        //seteo el modo borrador
        if (e.value === true) {
            grid.component.columnOption("agrupamientoId", "groupIndex", 0);
            grid.component.expandAll();
        }
        else
            grid.component.clearGrouping();
    }

    onRowInserted(e) {
        const id = e.data.preCargaGastoId;
        e.data.preCargaGastoId = 0;
        PreCargaGastoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.preCargaGastoId = id;
    }

    onRowInserting(e) {
        
        //me aseguro de que tenga completos los campos requeridos
        if (e.data.agrupamientoId === undefined
            || e.data.descriptor === undefined
            || e.data.proveedorId === undefined
            || e.data.tipoDePago === undefined
            || e.data.edificioId === undefined
            || e.data.agrupamientoId === null
            || e.data.descriptor === null
            || e.data.proveedorId === null
            || e.data.tipoDePago === null
            || e.data.edificioId === null) {
            e.cancel = true;
            e.component.clearGrouping();

            Notifier.mostrarNotificacion("Debe completar todos los campos obligatorios", "error", 3000);
        }
    }

    onRowUpdated(e) {
        PreCargaGastoService.modificar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            });
    }

    onRowRemoved(e) {
        PreCargaGastoService.borrar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            });
    }

    validarFechaPago(e) {
        //es valido cuando es impago y no tengo fecha, o cuando es Efectivo/CCADM y tengo fecha pago
        var valid = (e.value === null && e.data.tipoDePago === 1) || (e.value !== null && e.data.tipoDePago !== 1);
        return valid;
    }

    onContextMenuItems(e)
    {
        if (e.row && e.row.rowType === "data") {
            e.items = [{ text: "Duplicar fila", onItemClick: () => this.duplicateRow(e) }];
        }
    }

    onToolbarPreparing(e) {
        let grid = e;

        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            showText: "always",
            locateInMenu: "never",
            options: {
                icon: 'download',
                type: 'default',
                text: 'Enviar a ADA4D',
                stylingMode:"contained",
                hint: 'Envía los gastos a ADA4D',
                disabled: this.state.items.filter(x => x.listoParaImportarAda4 === false).length === 0,
                onClick: () => this.listoParaEnviarAda4(grid)
            }
        },
        {
            location: 'after',
            widget: 'dxCheckBox',
            showText: "inMenu",
            locateInMenu: "auto",
            options: {
                text: 'Solo Agrupamientos Mis Expensas',
                hint: 'Muestra únicamente los agrupamientos Mis Expensas',
                value: this.state.mostrarSoloMisExpensas,
                onValueChanged: this.mostrarSoloMisExpensasClick
            }
        },
        {
            location: 'after',
            widget: 'dxCheckBox',
            showText: "inMenu",
            locateInMenu: "auto",
            options: {
                text: 'Incluir importados',
                hint: 'Incluye en el listado todos aquellos gastos que ya fueron importados en ADA4D',
                value: this.state.incluirImportados,
                onValueChanged: this.incluirImportadosClick
            }
        },
        {
            location: 'after',
            widget: 'dxCheckBox',
            showText: "inMenu",
            locateInMenu: "auto",
            options: {
                text: 'Modo borrador',
                name: "btnModoBorrador",
                hint: 'Muestra los gastos junto con un subtotal agrupados por la columna Agrupamiento',
                value: this.state.modoBorrador,
                onValueChanged: (e) => this.modoBorradorClick(e, grid)
            }
        });

        let saveButton = e.toolbarOptions.items.find(x => x.name === "saveButton");
        if (saveButton !== undefined) {
            //muestro el boton Guardar siempre
            saveButton.locateInMenu = "never";
        }
        
        let addButton = e.toolbarOptions.items.find(x => x.name === "addRowButton");
        if (addButton !== undefined) {
            //muestro el boton Nueva fila siempre
            addButton.locateInMenu = "never";

            //escucho el click de la nueva fila
            addButton.options.onClick = function (args) {

                //destildo el modo borrador
                let inputModoBorrador = document.querySelector("[role=checkbox] [name=btnModoBorrador]");

                if (inputModoBorrador.value === "true")
                    inputModoBorrador.parentElement.click();

                //solo dejo agregar de a 1 fila
                if (e.component.getVisibleRows().filter(x => x.rowType === "data" && x.inserted === true).length === 0) {
                    e.component.addRow();
                }
                else {
                    Notifier.mostrarNotificacion("Debe confirmar o cancelar los cambios antes de agregar una nueva fila", "success", 3000);
                }
            };
        }
    }

    onEditorPreparing(e) {
        var row = null;
        var grid = e.component;

        //no dejo editar si ya fue marcado como para importar   
        if (e.row !== undefined && e.row.data.listoParaImportarAda4 === true) {
            e.editorOptions.disabled = e.row.data.listoParaImportarAda4 === true;
            return;
        }

        //bajo el searchTimeout, para que funcione mejor el copy y paste en los combos
        if (e.editorOptions.searchEnabled === true) {
            e.editorOptions.searchTimeout = 50;
        }

        if (e.dataField === "importeTotal") {
            e.editorOptions.format = "$ ###.00";
        }

        if (e.dataField === "edificioId") {
            row = e.row;
            let originalEvent = e.editorOptions.onValueChanged;

            e.editorOptions.onValueChanged = (e) => {
                //borro el texto pregrabado del edificio anterior
                row.data.textoPregrabadoId = null;
                this.dataSources.edificioSeleccionadoId = null;

                //agrego la forma de pago default del edificio
                let tipoDePagosEdif = this.dataSources.tiposDePagoPorEdificio.find(x => x.edificioId === e.value);
                let tipoDePagoEdificio = tipoDePagosEdif !== undefined
                    ? tipoDePagosEdif.tipoFormaDePago
                    : this.dataSources.tiposDePago[0].id;

                grid.cellValue(row.rowIndex, "tipoDePago", tipoDePagoEdificio);

                //si es IMPAGO, borro la fecha de Pago
                if (tipoDePagoEdificio === 1) {
                    grid.cellValue(row.rowIndex, "fechaPago", null);
                }
                originalEvent(e);
            }
        }

        if (e.dataField === "fechaFactura") {
            e.editorOptions.onKeyUp = (e) => {
                //si pone un "." seteo la fecha como Now
                if (e.event.key === ".") {
                    e.component.option("value", new Date());
                }
            }
        }

        if (e.dataField === "fechaPago") {
            
            e.editorOptions.onKeyUp = (e) => {
                //si pone un "." seteo la fecha como Now
                if (e.event.key === ".") {
                    e.component.option("value", new Date());
                }
            }

            row = e.row;
            
            let originalEvent = e.editorOptions.onValueChanged;

            e.editorOptions.onValueChanged = (e) => {
                //si esta IMPAGO, borro el tipo de pago
                if (row.data.tipoDePago === 1) {  
                    grid.cellValue(row.rowIndex, "tipoDePago", null);
                }
                originalEvent(e);
            }
        }

        if (e.dataField === "tipoDePago") {
            row = e.row;
            let originalEvent = e.editorOptions.onValueChanged;

            e.editorOptions.onValueChanged = (e) => {
                originalEvent(e);
                //si es impago, borro la fecha de pago
                if (e.value === 1) {
                    grid.cellValue(row.rowIndex, "fechaPago", null);
                }
                else {
                    //si no tiene fecha le pongo el now
                    if (grid.cellValue(row.rowIndex, "fechaPago") === null) {
                        grid.cellValue(row.rowIndex, "fechaPago", new Date());
                    }
                }
            }
        }

        if (e.dataField === "proveedorId") {
            //busco a partir de 3 caracteres minimo
            e.editorOptions.minSearchLength = 3;
            e.editorOptions.buttons = [];
            e.editorOptions.openOnFieldClick = false;
        }

        if (e.dataField === "textoPregrabadoId") {
            row = e.row;

            e.editorOptions.onFocusIn = (e) => {
                e.component.option("placeholder", "Cargando...");
                var edificioId = row.data.edificioId;

                if (edificioId != null) {
                    this.dataSources.edificioSeleccionadoId = edificioId;

                    var textosPregrabadosDelEdificio = this.dataSources.textosPregrabados.filter((value, index) => value.edificioId === edificioId);

                    //lleno los textosPregrabados del edificio
                    if (textosPregrabadosDelEdificio.length === 0) {
                        PreCargaGastoService.listarTextosPregrabados((data) => {
                            this.dataSources.textosPregrabados.push({ edificioId: edificioId, textosPregrabados: data });
                            this.checkIsLoaded();
                        }, edificioId);
                    }
                    else {
                        e.component.option("placeholder", "Seleccionar...");
                    }
                }
            }

            //escucho el onchange del combo
            let originalEvent = e.editorOptions.onValueChanged;
            
            e.editorOptions.onValueChanged = (e) => {
                var data = e.component.getDataSource().items().find((val, index) => val.id === e.value);

                //actualizo el importeTotal con el sum de los importes de todos los porcentuales
                grid.cellValue(row.rowIndex, "agrupamientoId", data.agrupamientoId);
                grid.cellValue(row.rowIndex, "descriptor", data.descripcion);
                grid.cellValue(row.rowIndex, "importeTotal", data.importe);
                grid.cellValue(row.rowIndex, "proveedorId", data.proveedorId);

                //TODO: Ver el tema de los items
                originalEvent(e);
            }
        }
    }

    textosPregrabadosDelEdificio() {
        var textosPregrabadosDelEdificio = this.dataSources.textosPregrabados.find((value, index) => value.edificioId === this.dataSources.edificioSeleccionadoId);
        return textosPregrabadosDelEdificio === undefined ? [] : textosPregrabadosDelEdificio.textosPregrabados;
    }

    duplicateRow(e)
    {
        //solo dejo agregar de a 1 fila
        if (e.component.getVisibleRows().filter(x => x.rowType === "data" && x.inserted === true).length === 0) {
            var newData = { ...e.row.data };
            newData.preCargaGastoId = 0;
            e.component.addRow();

            //copio todas las props del json
            for (var key in newData) {
                e.component.cellValue(0, key, newData[key]);
            }
        }
        else {
            Notifier.mostrarNotificacion("Debe confirmar o cancelar los cambios antes de agregar una nueva fila", "success", 3000);
        }
    }

    cellRenderImporte(td, celldata) {
        var text = celldata.value !== undefined ? "$ " + parseFloat(celldata.value).toFixed(2) : "";
        td.innerHTML = text;
    }

    renderSubGrilla(e) {
        return <PreCargaGastoImporte parentGrid={e} tituloSubGrilla={this.tituloSubGrilla} />
    }

    onInitNewRow(e) {
        
        //seteo los valores por default a la fila nueva
        e.data.fechaPago = new Date();

        //selecciono el prov no definido por default
        e.data.proveedorId = this.dataSources.proveedores.find(e => e.descripcion === "PROVEEDOR NO DEFINIDO").id;
    }

    onEditingStart(e) {
    }

    onRowPrepared(e) {
        if (e.rowType === 'data' && e.data.listoParaImportarAda4 === true) {
            e.rowElement.style.cursor = "not-allowed";
            e.rowElement.title = "No es posible modificar un gasto ya importado en ADA4D";
            e.rowElement.style.backgroundColor = "#cccccc";
        }  
    }

    onCellPrepared(options) {
        /*if (options.rowType === "data" && options.column.command === "edit") {

            //no se pueden eliminar los que ya estan listos para importar
            if (options.data.listoParaImportarAda4 === true) {
                var deleteLink = options.cellElement.querySelector(".dx-link.dx-link-delete");
                deleteLink.remove();
            }
        }*/
    }

    calculateSortValue(data) {
        //ordeno por descripcion
        let value = this.calculateCellValue(data);
        return this.lookup.calculateCellValue(value);
    } 

    pregrabadoCellTemplate(elem, data) {
        if (data.rowType === "data")
            elem.innerHTML = "...";
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'preCargaGastoId'}
                    onRowInserted={this.onRowInserted}
                    onRowInserting={this.onRowInserting}
                    onRowUpdated={this.onRowUpdated}
                    autoExpandAll={this.state.modoBorrador}
                    onRowRemoved={this.onRowRemoved}
                    onRowValidating={this.onRowValidating}
                    onRowPrepared={this.onRowPrepared}
                    onEditingStart={this.onEditingStart}
                    onInitNewRow={this.onInitNewRow}
                    onCellPrepared={this.onCellPrepared}
                    onEditorPreparing={this.onEditorPreparing}
                    onContextMenuPreparing={this.onContextMenuItems}
                    onToolbarPreparing={this.onToolbarPreparing}
                >
                    <Column dataField="edificioId" caption="Edificio" dataType={"number"} minWidth={200} calculateSortValue={this.calculateSortValue} >
                        <Lookup dataSource={() => this.dataSources.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="textoPregrabadoId" caption="Texto Pregrabado" dataType={"number"} minWidth={150} cellTemplate={this.pregrabadoCellTemplate} >
                        <Lookup dataSource={() => this.textosPregrabadosDelEdificio()} valueExpr={'id'} displayExpr={'descripcion'} />
                    </Column>

                    <Column dataField="numeroComprobante" caption="Nro. Cpte" title="Número de Comprobante" minWidth={100} >
                        <StringLengthRule max="20" />
                    </Column>

                    <Column dataField="descriptor" caption="Descripción" minWidth={100} >
                        <RequiredRule />
                        <StringLengthRule max="8000" />
                    </Column>

                    <Column dataField="importeTotal" caption="Importe" dataType={"number"} title="Importe total de la factura" minWidth={100} cellTemplate={this.cellRenderImporte} >
                        <RangeRule min="0" />
                    </Column>

                    <Column dataField="agrupamientoId" caption="Agrupamiento" dataType={"number"} minWidth={100} sortIndex={3} >
                        <Lookup dataSource={() => this.dataSources.agrupamientosFiltrados} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="proveedorId" caption="Proveedor" dataType={"number"} minWidth={100} calculateSortValue={this.calculateSortValue} >
                        <Lookup dataSource={() => this.dataSources.proveedores} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="numeroFactura" caption="Nro. Factura" title="Número de factura" minWidth={100} >
                        <StringLengthRule max="50" />
                    </Column>

                    <Column dataField="fechaFactura" caption="Fecha Factura" dataType={"date"} minWidth={100} />
                    <Column dataField="fechaPago" caption="Fecha Pago" dataType={"date"} minWidth={100} >
                        <CustomRule validationCallback={this.validarFechaPago} message={"Fecha Pago es obligatoria"}  />
                    </Column>

                    <Column dataField="tipoDePago" caption="Tipo De Pago" dataType={"number"} minWidth={100} calculateSortValue={this.calculateSortValue} >
                        <Lookup dataSource={() => this.dataSources.tiposDePago} valueExpr={'id'} displayExpr={'descripcion'} /> 
                        <RequiredRule />
                    </Column>

                    <Column dataField="fechaPreCarga" caption="Fecha De Carga" title="Fecha de carga del gasto" dataType={"date"} minWidth={100} allowEditing={false} >
                    </Column>

                    <Column dataField="userName" caption="Usuario" title="Usuario" minWidth={100}  allowEditing={false} >
                    </Column>

                    <Summary  recalculateWhileEditing={true}>
                        <GroupItem showInGroupFooter={false} column={"agrupamientoId"} summaryType={"count"} displayFormat={"{0}"} alignByColumn={false} >
                        </GroupItem>
                        
                        <GroupItem showInGroupFooter={true} column={"importeTotal"}  summaryType={"sum"} displayFormat={"Total: $ {0}"} alignByColumn={false} >
                            <ValueFormat type={"fixedPoint"} precision={2} />
                        </GroupItem>

                        <TotalItem column={"importeTotal"} summaryType={"sum"} displayFormat={"Total de Gastos: $ {0}"}>
                            <ValueFormat type={"fixedPoint"} precision={2} />
                        </TotalItem>
                    </Summary> 

                    <MasterDetail
                        enabled={true}
                        autoExpandAll={false}
                        render={this.renderSubGrilla}
                    />

                </ADAGrid>

            </div>
        );
    }
}