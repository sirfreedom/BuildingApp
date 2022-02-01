import React from 'react';

import DropDownBox from 'devextreme-react/drop-down-box';
import DataGrid, { Selection, Scrolling, Paging, FilterRow } from 'devextreme-react/data-grid';

export default class ADADropDownFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponenteGrid: Math.random().toString().replace(".", ""),
            idComponenteCombo: Math.random().toString().replace(".", ""),
            gridBoxValue: '',
            gridSelectedRowKeys: [this.props.selectedItemId]
        };
        
        this.dataGridRender = this.dataGridRender.bind(this);
        this.dataGrid_onSelectionChanged = this.dataGrid_onSelectionChanged.bind(this);
        this.syncDataGridSelection = this.syncDataGridSelection.bind(this);
        this.onContentReady = this.onContentReady.bind(this);
        this.gridBox_onOpened = this.gridBox_onOpened.bind(this);
        this.gridBox_onClosed = this.gridBox_onClosed.bind(this);
        this.gridBox_onKeyDown = this.gridBox_onKeyDown.bind(this);
        this.force_KeyDown = this.force_KeyDown.bind(this);
		this.filtrarItem = this.filtrarItem.bind(this);}

    onContentReady(e) {
        
        let idComponenteGrid = this.state.idComponenteGrid;
        let columnIndexFocus = this.props.columnIndexFocus;

        //busco el input del filtro y le doy foco
        setTimeout(function () {
            try {
                document.getElementById(idComponenteGrid).getElementsByTagName("input")[columnIndexFocus].focus();
            } catch (e) {
                //nada
            }
        }, 100);
    }

    dataGridRender() {
        return (
            <div id={this.state.idComponenteGrid} onKeyDown={this.gridBox_onKeyDown}>
                <DataGrid
                    dataSource={this.props.items}
                    keyExpr={this.props.keyExpr}
                    selectedRowKeys={this.state.gridSelectedRowKeys}
                    onSelectionChanged={this.dataGrid_onSelectionChanged}
                    onCleanSelection={this.props.onCleanSelection} 
                    hoverStateEnabled={true}
                    onKeyDown={this.force_KeyDown}
                    focusedRowEnabled={true}
                    height={"400px"}
                >
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} showScrollbar={"always"} />
                    <Paging enabled={false} pageSize={10} />
                    <FilterRow visible={true} />

                    {this.props.children}
                    
                </DataGrid>
            </div>
        );
    }

    dataGrid_onSelectionChanged(e) {
        if (e.currentSelectedRowKeys.length === 0)
            return;

        this.gridBox_onClosed();

        let itemId = e.selectedRowKeys.length && e.selectedRowKeys[0];
        this.onSelectionChanged(itemId);

    }

    filtrarItem(itemId) {
        const keyExpr = this.props.keyExpr;
        return this.props.items.filter((item) => item[keyExpr] === itemId)[0];
    }

    onSelectionChanged(itemId) {
        const keyExpr = this.props.keyExpr;
        const newValue = this.filtrarItem(itemId);
        let texto = this.props.descripcionVisual(newValue);

        this.setState({
            gridBoxValue: texto,
            gridSelectedRowKeys: !newValue ? [] : [newValue[keyExpr]]
        });

        this.props.onSelectedItem(itemId);
    }

    gridBox_onKeyDown(e) {
        if (e.keyCode === 27) {
            this.gridBox_onClosed();
        }
    }
    
    gridBox_onOpened() {
        this.onContentReady();
    }

    gridBox_onClosed() {
        let idComponenteCombo = this.state.idComponenteCombo;
        document.getElementById(idComponenteCombo).getElementsByClassName("dx-texteditor-container")[0].click();
    }

    force_KeyDown(e) {
        if (e.event.keyCode === 27) {
            this.gridBox_onClosed();
        }

    }

    syncDataGridSelection(e) {
        let texto = this.props.descripcionVisual(e);

        this.setState({
            gridBoxValue: texto,
            gridSelectedRowKeys: !e.value ? [] : [e.value]
        })

        if (e.value == null && this.props.onCleanSelection) {
            this.props.onCleanSelection();
        }
    }

    render() {
        const selectedValueText = this.props.descripcionVisual(this.filtrarItem(this.props.selectedItemId));

        return (
            <div >
                <DropDownBox
                    id={this.state.idComponenteCombo}
                    className={"dropDownBuscadores"}
                    valueExpr={this.props.keyExpr}
                    value={this.state.gridBoxValue}
                    displayExpr={this.state.gridBoxValue || selectedValueText}
                    displayValueFormatter={() => this.state.gridBoxValue || selectedValueText}
                    deferRendering={true}
                    showClearButton={true}
                    onOpened={this.gridBox_onOpened}
                    onKeyDown={this.gridBox_onClosed}
                    placeholder={this.props.placeholder}
                    dataSource={{
                        data: this.props.items,
                        key: this.props.keyExpr
                    }}
                    contentRender={this.dataGridRender}
                    onValueChanged={this.syncDataGridSelection}
                    width={"calc(50vw - 130px)"}
                >
                </DropDownBox>
            </div>
        );
    }
}