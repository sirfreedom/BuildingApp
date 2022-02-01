import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { PorcentualPorLiquidacionService } from '../../services/PorcentualPorLiquidacionService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class PorcentualesEdificioBuscador extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridSelectedRowKeys: [],
            items: null,
            selectedItems: [],
        };

        this.edificioId = this.props.edificioId;
        this.refrescar = this.refrescar.bind(this);
        this.onSelectedItems = this.props.onSelectedItems.bind(this);
        this.onAccepted = this.onAccepted.bind(this);
        this.dataGridOnSelectionChanged = this.dataGridOnSelectionChanged.bind(this);
        this.descripcionVisual = this.descripcionVisual.bind(this);

        this.refrescar();
    }

    refrescar() {
        if (this.edificioId == null) return;
        PorcentualPorLiquidacionService.listarPorEdificio(this.edificioId, data => {
            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.porcentualPorLiquidacionId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.porcentualPorLiquidacionId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.porcentualPorLiquidacionId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.descriptor;
    }


    render() {
        return (
            <div className="row">
                {this.state.items && <ADAMultipleDropDownFilter
                    keyExpr={'porcentualPorLiquidacionId'}
                    items={this.state.items}
                    deferRendering={false}
                    showClearButton={true}
                    placeholder={'Seleccione uno o varios porcentuales...'}
                    dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                    descripcionVisual={this.descripcionVisual}
                    ModoSingleSelection={this.props.ModoSingleSelection}
                    selectedItems={this.state.selectedItems}
                    >

                    <Column dataField="porcentualPorLiquidacionId" caption="porcentualPorLiquidacionId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="liquidacionId" caption="LiquidacionId" allowEditing={false} visible={false}></Column>
                    <Column dataField="numero" caption="Número" allowEditing={false} alignment={"left"} width="auto"></Column>
                    <Column dataField="ordenParaCobranzas" caption="Orden para cobranzas" allowEditing={false}  alignment={"left"} width="auto"></Column>
                    <Column dataField="descriptor" caption="Descriptor" allowEditing={false}  alignment={"left"} width="auto"></Column>

                </ADAMultipleDropDownFilter>}
            </div>
        );
    }
}