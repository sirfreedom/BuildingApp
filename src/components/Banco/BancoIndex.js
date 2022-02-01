import React, { Component } from "react";

import { Item } from "devextreme-react/form";
import ADAGrid from "../Grid/ADAGrid";
import { Notifier } from '../Grid/Notifier';
import dxSelectBox from "devextreme/ui/select_box";
import dxCheckBox from "devextreme/ui/check_box";
import Edificios from "../DropDownBoxes/Edificios";

//exportar arhivos
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

import {
  Card,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import {
  Column,
  ColumnChooser,
  Editing,
  Export,
  Popup,
  Form,
  GroupPanel,
  Lookup,
  SearchPanel,
} from "devextreme-react/data-grid";


import RadioGroup from "devextreme-react/radio-group";

import { ABMBancosService } from "../../services/ABMBancos";
import { EdificioService } from "../../services/EdificioService";
import { BancoService } from "../../services/BancoService";
import { confirm } from 'devextreme/ui/dialog';
import $ from 'jquery';


export class BancoIndex extends Component {
  constructor(props) {
    super(props);
    this.today = new Date();
    this.popupVisible = this.props.popupVisible;
    this.options = [
      { id: 1, text: "De la Administración" },
      { id: 0, text: "Del Edificio" }
    ];
    this.edificioId = 4;
    this.state = {
      titulo: "",
      subtitulo: "",
      optionSelected: 0,
      edificioSelected: 0,
      edificios: [],
      listEdificio: [],
      listAdministracion: [],
      listTipoCuenta: [],
      bancos: [],
      bancoSelected: "",
      idCuentaEdif: {},
      idCuentaAdm: {},
      tipocuentaID: 0,
      tituloPopup: "",
      subtituloPopup: "",
      puedeCrear:false,
    };


    this.closePopup = this.closePopup.bind(this);
    this.cargaListaEdificio = this.cargaListaEdificio.bind(this);
    this.cargaListaAdministracion = this.cargaListaAdministracion.bind(this);
    this.changeSelection = this.changeSelection.bind(this);
    this.saveSelection = this.saveSelection.bind(this);
    this.loadGrid = this.loadGrid.bind(this);
    this.onEditingStartRow = this.onEditingStartRow.bind(this);
    this.loadlistTipoCuenta = this.loadlistTipoCuenta.bind(this);
    this.cargarBancos = this.cargarBancos.bind(this);
    this.selectBanco = this.selectBanco.bind(this);
    this.resuelveEdificios = this.resuelveEdificios.bind(this);
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.onRowRemoved = this.onRowRemoved.bind(this);
    this.onInitNewRow = this.onInitNewRow.bind(this);
    this.onExporting = this.onExporting.bind(this);
    this.onEditorPrepared = this.onEditorPrepared.bind(this);
    this.cleanSelection = this.cleanSelection.bind(this);
    this.onBankRowRemoving = this.onBankRowRemoving.bind(this);

    EdificioService.listarAutocomplete((data) =>
      this.setState({edificios: data})
    )

    this.loadlistTipoCuenta()
    this.cargarBancos()
    this.loadGrid()
  }

  closePopup() {
    this.setState({ popupVisible: false });
  }

  changeSelection(e) {
    if (e.value === 0) {
      this.setState({
        optionSelected: 0,
        items: false,
        listEdificio: [],
        listAdministracion: [],
      })
      if(this.state.edificioSelected.length > 0){
        this.setState({puedeCrear:true})
      }else{
        this.setState({puedeCrear:false})
      }
    }else {
      this.setState({
        optionSelected: 1,
        items: false,
        listEdificio: [],
        listAdministracion: [],
        puedeCrear:true,
      })
    }
    this.loadGrid()
  }

  cargarBancos() {
    BancoService.listarAutocomplete((data) => {
      this.setState({ bancos: data })
    })
  }

  cargaListaEdificio(id) {
    ABMBancosService.listarCuentaEdificio(id, (data) => {
      this.setState({ listEdificio: data })
    })
  }

  cargaListaAdministracion() {
    ABMBancosService.listarCuentaAdministracion((data) => {
      this.setState({ listAdministracion: data })
    })
  }

  saveSelection(e) {  
    this.setState({ edificioSelected: e, items: false, });
    if(this.state.edificioSelected > 0){
      this.setState({puedeCrear:true})
    }
    this.loadGrid()
  }

  cleanSelection(){
    this.setState({edificioSelected:0})
    this.setState({puedeCrear:false})
    this.loadGrid()
  }

  loadGrid() {
    if (this.state.optionSelected === 0) {
      this.cargaListaEdificio(this.state.edificioSelected);
    } else {
      this.cargaListaAdministracion();
    }
  }

  loadlistTipoCuenta() {
    ABMBancosService.listarCuentaTipo((data) =>
      this.setState({ listTipoCuenta: data })
    );
  }

  onEditorPrepared(e) {
    if (e.caption === "Tipo de Cuenta" && e.row.isNewRow !== undefined) {
      let selectBoxTipoCuenta = dxSelectBox.getInstance(e.editorElement);
      selectBoxTipoCuenta.option("value", 1);
    }
    if ((e.caption === "Banco") && (e.row.isNewRow === undefined)) {
      let selectBoxBanco = dxSelectBox.getInstance(e.editorElement);
      let bancoSelected = this.state.bancos.filter((bank) => bank.id === e.row.data.bancoId);
      selectBoxBanco.option("value", bancoSelected[0].descripcion);
    }
    if (e.caption === "Mostrar conciliado" && (e.row.isNewRow !== undefined)) {
      let selectBoxConciliado = dxCheckBox.getInstance(e.editorElement);
      selectBoxConciliado.option("value", true);
    }
    if (e.caption === "Habilitado" && (e.row.isNewRow !== undefined)) {
      let selectBoxHabilitado = dxCheckBox.getInstance(e.editorElement);
      selectBoxHabilitado.option("value", true);
    }
  }

  resuelveEdificios(e) {
    if (e !== null) {
      return e.id + " - " + e.descripcion;
    } else {
      return null;
    }
  }

  selectBanco(e) {
    this.setState({ bancoSelected: e.value });
  }

  onInitNewRow(e) {
    if (this.state.optionSelected === 0) {
      if (this.state.edificioSelected !== 0) {
        let nombreEdificio = this.state.edificios.filter((edificio) => edificio.id === this.state.edificioSelected)
        this.setState({ tituloPopup: "CREAR Cuenta bancaria de Edificio" })
        this.setState({ subtituloPopup: "Nombre edificio: " + nombreEdificio[0].descripcion })
      } else {
        Notifier.mostrarNotificacion("Debe seleccionar un edificio para dar de alta", "error", 3000)
      }
    } else {
      this.setState({ tituloPopup: "CREAR Cuenta bancaria de Administracion" })
      this.setState({ subtituloPopup: "Nombre administracion: " + (this.state.listAdministracion[0]?.nombre ?? "") })
    }
  }

  onRowInserted(e) {
    let bancoSelected = this.state.bancos.filter((bank) => bank.descripcion === e.data.banco);
    if (this.state.optionSelected === 0) {  //seleccionado edificio
      if (this.state.edificioSelected !== 0) {    //no se puede agregar sin elegir un edificio especifico
        let mockEdificio = {
          edificioId: this.state.edificioSelected,
          bancoId: bancoSelected[0].id, //required
          mostrarSaldoBancoConciliado: e.data.mostrarSaldoBancoConciliado,
          cbu: e.data.cbu || "",
          nombreBanco: e.data.nombreBanco,  //required
          habilitado: e.data.habilitado,
                    predeterminadaParaGastos: e.data.predeterminadaParaGastos,
                    predeterminadaParaCobranzas: e.data.predeterminadaParaCobranzas,
          alias: e.data.alias || "",
          sucursal: e.data.sucursal || "",
          numeroDeCuenta: e.data.numeroDeCuenta || "",
          titular: e.data.titular || "",
          cuit: e.data.cuit || "",
          tipoDeCuentaId: e.data.tipoDeCuentaId, //required
        }

        ABMBancosService.agregarCuentaEdificio(mockEdificio, //e.data, 
                    (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
          (resp) => Notifier.mostrarNotificacion(resp.message + "edificios", "error", 3000),
                ).then(() => this.loadGrid());
      }
    } else {                        //seleccionado administracion
      let mockAdministracion = {
        bancoId: bancoSelected[0].id,  //required
        mostrarSaldoBancoConciliado: e.data.mostrarSaldoBancoConciliado,
        cbu: e.data.cbu || "",
        nombreBanco: e.data.nombreBanco,  //required
        tMarcaFecha: this.today.toISOString(),
        habilitado: e.data.habilitado,
                predeterminadaParaGastos: e.data.predeterminadaParaGastos,
                predeterminadaParaCobranzas: e.data.predeterminadaParaCobranzas,
        alias: e.data.alias || "",
        sucursal: e.data.sucursal || "",
        numeroDeCuenta: e.data.numeroDeCuenta || "",
        titular: e.data.titular || "",
        cuit: e.data.cuit || "",
        tipoDeCuentaId: e.data.tipoDeCuentaId, //required
      }
      ABMBancosService.agregarCuentaAdministrador(mockAdministracion,  //e.data,
                (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
                (resp) => Notifier.mostrarNotificacion(resp.message, "error", 3000)
            ).then(() => this.loadGrid());
    }
  }

  onEditingStartRow(e) {
    this.setState({ tituloPopup: "Cuenta bancaria de: " + e.data.titular })
    if (this.state.optionSelected === 0) {
            let nombreEdificio = this.state.edificios.filter((edificio) => edificio.id === e.data.edificioId)
      this.setState({ subtituloPopup: "Nombre de Edificio: " + nombreEdificio[0].descripcion })
    } else {
      this.setState({ subtituloPopup: "Nombre de administracion: " + e.data.nombre })
    }

    if (e.hasOwnProperty("edificioId")) {
      this.setState({
        tipocuentaID: e.data.tipoDeCuentaId,
        idCuentaEdif: e.data.cuentaBancariaId,
        bancoSelected: e.data.nombreBanco,
      });
    } else {
      this.setState({
        tipocuentaID: e.data.tipoDeCuentaId,
        idCuentaAdm: e.data.cuentaBancariaId,
        bancoSelected: e.data.nombreBanco,
      });
    }
  }

  onRowUpdated(e) {
    if (this.state.optionSelected === 0) {
      ABMBancosService.modificarCuentaEdificio(e.data,
                (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
        (resp) => Notifier.mostrarNotificacion(resp.message, "error", 3000)
            ).then(() => this.loadGrid());
    } else {
      ABMBancosService.modificarCuentaAdministracion(e.data,
        (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
        (resp) => Notifier.mostrarNotificacion(resp.message, "error", 3000)
            ).then(() => this.loadGrid());
    }
  }

  onRowRemoved(e) {
    if (this.state.optionSelected === 0) {
      ABMBancosService.borrarCuentaEdificio(e.data,
                (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
        (resp) => Notifier.mostrarNotificacion(resp.message, "error", 3000)
            ).then(() => this.loadGrid()); 
    } else {
      ABMBancosService.borrarCuentaAdministracion(e.data,
                (resp) => { Notifier.mostrarNotificacion("Operación exitosa", "success", 3000); },
        (resp) => Notifier.mostrarNotificacion(resp.message, "error", 3000)
            ).then(() => this.loadGrid());
    }
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');
    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        if (this.state.optionSelected === 0) {
          if (this.state.edificioSelected === 0) {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CuentasBancariasTodosEdificios.xlsx');
          } else {
            ABMBancosService.listarCuentaEdificio(this.state.edificioSelected, (data) => {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CuentasBancarias' + data[0].codigoReemplazo + '.xlsx');
            });
          }
        } else {
          ABMBancosService.listarCuentaAdministracion((data) =>
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CuentasBancarias' + data[0].nombre + '.xlsx')
          );
        }
      });
    });
    e.cancel = true;
  }

  
  onBankRowRemoving(e) {
    let index = e.component.getRowIndexByKey(e.key);
    let rowEl = e.component.getRowElement(index);
    $(rowEl).addClass("rowToDelete"); 
    let res = confirm("¿Desea borrar el banco: " + e.key.nombreBanco + "?");
    let d = $.Deferred();
    
    e.cancel = d.promise();
    res.done((dialogResult) => {
      $(rowEl).removeClass("rowToDelete");
      if (!dialogResult)
        d.resolve(true)
      else
        d.resolve() 
    });
  }

  render() {
    return (
      <div>
        <TableBody>
          <Card
            className={"card"}
            title={"Tipos de cuentas bancarias"}
          >
            <TableRow>
                <TableCell>
                  <RadioGroup
                    items={this.options}
                    defaultValue={this.options[1].id}
                    valueExpr="id"
                    displayExpr="text"
                    onValueChanged={this.changeSelection}
                  />
                </TableCell>
                <TableCell style={this.state.optionSelected !== 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                  <Edificios
                    edificioId={
                      this.state.optionSelected === 0
                        ? this.state.edificios
                        : null
                    }
                    onSelectedItem={this.saveSelection}
                    onCleanSelection={this.cleanSelection}
                    columnIndexFocus={0}
                  />
                </TableCell>
            </TableRow>
          </Card>
        </TableBody>
        <br />
        <ADAGrid
          items={
            this.state.optionSelected === 0
              ? this.state.listEdificio
              : this.state.listAdministracion
          }
          allowEditing={true}
          allowAdding={false}
          allowDeleting={true}
          editingMode={"popup"}
          height={"calc(100vh - 175px)"}
          onContextMenuPreparing={() => {}}
          onEditingStart={this.onEditingStartRow}
          onRowUpdated={this.onRowUpdated}
          onInitNewRow={this.onInitNewRow}
          onRowInserted={this.onRowInserted}
          onRowRemoved={this.onRowRemoved}
          onExporting={this.onExporting}
          onEditorPrepared={this.onEditorPrepared}
          onRowRemoving={this.onBankRowRemoving}
        >
          <ColumnChooser enabled={true} />
          <Export enabled={true} />
          <GroupPanel visible={true} />
          <SearchPanel visible={true} />
          <Export enabled={true} />
          <Editing
            confirmDelete={false}
            mode="popup"
            allowUpdating={true}
            allowAdding={this.state.puedeCrear}
            allowDeleting={true}
          >
            <Popup
              title={this.state.tituloPopup + '------' + this.state.subtituloPopup}
              showTitle={true}
              width={900}
              height={600}
            />
            <Form >
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="nombreBanco" caption="Nombre Banco" dataType="text" isRequired={true} />
                <Item dataField="banco" caption="Banco" isRequired={true} />
                <Item dataField="cbu" />
                <Item dataField="numeroDeCuenta" />
                <Item dataField="cuit" />
                <Item dataField="alias" />
                <Item dataField="tipoDeCuentaId" isRequired={true} />
                <Item dataField="sucursal" />
                <Item itemType="empty" />
                <Item dataField="titular" />
                <Item dataField="mostrarSaldoBancoConciliado" />
                <Item dataField="habilitado" />
                                <Item dataField="predeterminadaParaGastos" />
                                <Item dataField="predeterminadaParaCobranzas" />
              </Item>
            </Form>
          </Editing>
          {
            this.state.optionSelected === 0
              ? <Column dataField="codigoReemplazo" caption="Codigo reemplazo" ></Column>
              : null
          }
          {
            this.state.optionSelected === 0
              ? <Column dataField="direccionFormateada" caption="Direccion codigo reemplazo" ></Column>
              : null
          }
          <Column dataField="nombreBanco" caption="Nombre Banco" ></Column>
          <Column dataField="banco" caption="Banco" visible={false}>
            <Lookup dataSource={this.state.bancos} valueExpr="descripcion" displayExpr="descripcion" />
          </Column>
          <Column dataField="alias" caption="Alias"></Column>
          <Column dataField="numeroDeCuenta" caption="Número de cuenta" ></Column>
          <Column dataField="sucursal" caption="Sucursal"></Column>
          <Column dataField="titular" caption="Titular"></Column>
          <Column dataField="cuit" caption="Cuit"></Column>
          <Column dataField="tipoDeCuentaId" caption="Tipo de Cuenta"  >
            <Lookup dataSource={this.state.listTipoCuenta} valueExpr="tipoDeCuentaId" displayExpr="descriptor" />
          </Column>
          <Column dataField="mostrarSaldoBancoConciliado" caption="Mostrar conciliado" editorType="dxCheckBox" ></Column>
          <Column dataField="habilitado" caption="Habilitado" editorType="dxCheckBox" ></Column>
                    <Column dataField="predeterminadaParaGastos" caption="Predeterminada Para Gastos" editorType="dxCheckBox" ></Column>
                    <Column dataField="predeterminadaParaCobranzas" caption="Predeterminada Para Cobranzas" editorType="dxCheckBox" ></Column>
          <Column dataField="cbu" visible={false} caption="Cbu"></Column>
          <Column dataField="tMarcaFecha" caption="Fecha creacion" dataType="datetime"></Column>
        </ADAGrid>
      </div>
    );
  }
}
