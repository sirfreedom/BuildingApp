import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { CuentaBancariaService } from '../../services/CuentaBancariaService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class CuentaBancariaBuscadorDropDown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridSelectedRowKeys: [],
            items: null,
            selectedItems: [],
            BloquearFiltros: this.props.BloquearFiltros,
            filtroTipoCuenta: this.props.IncluirCuentasDeLaAdministracion ? "" : "De edificio",
            CodigoReemplazo: this.props.CodigoReemplazo || "",
        };
        this.refrescar = this.refrescar.bind(this);
        this.onSelectedItems = this.props.onSelectedItems.bind(this);
        this.onAccepted = this.onAccepted.bind(this);
        this.dataGridOnSelectionChanged = this.dataGridOnSelectionChanged.bind(this);   
        this.descripcionVisual = this.descripcionVisual.bind(this);

        this.refrescar();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            BloquearFiltros: nextProps.BloquearFiltros,
            filtroTipoCuenta: nextProps.IncluirCuentasDeLaAdministracion ? "" : "De edificio",
            CodigoReemplazo: nextProps.CodigoReemplazo || "",
        });
        this.refrescar();
    }

    refrescar() {
        CuentaBancariaService.listar(data => {
            this.setState({ items: null });
            if(this.state.BloquearFiltros && this.state.filtroTipoCuenta !== "")
                data = data.filter(x => x.tipoDeCuentaId === 1);
            if(this.state.BloquearFiltros && this.state.CodigoReemplazo)
                data = data.filter(x => x.codigoReemplazo === this.state.CodigoReemplazo);

            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.cuentaBancariaId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.cuentaBancariaId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.cuentaBancariaId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.nombreBanco;
    }

    render() {
        return (
            <div>

                <div className="row">
                    {this.state.items && <ADAMultipleDropDownFilter
                        keyExpr={'cuentaBancariaId'}
                        items={this.state.items}
                        deferRendering={false}
                        showClearButton={true}
                        placeholder={'Seleccione una o varias cuentas bancarias...'}
                        dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                        descripcionVisual={this.descripcionVisual}
                        ModoSingleSelection={this.props.ModoSingleSelection}
                        selectedItems={this.state.selectedItems}
                        >

                        <Column dataField="cuentaBancariaId" caption="cuentaBancariaId" allowEditing={false} visible={false} ></Column>
                        <Column dataField="tipoDeCuentaId" caption="tipoDeCuentaId" allowEditing={false} visible={false}></Column>
                        <Column dataField="tipoDeCuenta" caption="Tipo de cuenta" allowEditing={false}
                            filterValue={this.state.BloquearFiltros ? "" : this.state.filtroTipoCuenta ? "De edificio" : ""} width="auto"></Column>
                        <Column dataField="codigoReemplazo" caption="Código reemplazo" allowEditing={false}
                            filterValue={this.state.BloquearFiltros ? "" : this.state.CodigoReemplazo} width="auto" ></Column>
                        <Column dataField="direccionFormateada" caption="Dirección" allowEditing={false} width="auto"></Column>
                        <Column dataField="bancoId" caption="bancoId" allowEditing={false} visible={false} ></Column>
                        <Column dataField="nombreBanco" caption="Banco" allowEditing={false}  width="auto"></Column>
                    </ADAMultipleDropDownFilter>}
                </div>
            </div>
        );
    }
}