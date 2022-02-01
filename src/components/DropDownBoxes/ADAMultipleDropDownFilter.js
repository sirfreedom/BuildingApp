import React from 'react';

import DropDownBox from 'devextreme-react/drop-down-box';
import DataGrid, { Selection, Scrolling, Paging, FilterRow, HeaderFilter } from 'devextreme-react/data-grid';

export default class ADAMultipleDropDownFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponenteGrid: Math.random().toString().replace(".", ""),
            idComponenteCombo: Math.random().toString().replace(".", ""),
            gridBoxValue: this.props.selectedItems || [],
        };
        
        this.dataGridRender = this.dataGridRender.bind(this);
        this.dataGrid_onSelectionChanged = this.props.dataGridOnSelectionChanged.bind(this);
        this.gridBox_onKeyDown = this.gridBox_onKeyDown.bind(this);
        this.gridBox_onOpened = this.gridBox_onOpened.bind(this);
        this.onContentReady = this.onContentReady.bind(this);
        this.cleanSelection = this.cleanSelection.bind(this);
    }

    dataGridRender() {
        return (
            <div id={this.state.idComponenteGrid} onKeyDown={this.gridBox_onKeyDown}>
                <DataGrid
                    dataSource={this.props.items}
                    onSelectionChanged={(e) => {
                        this.dataGrid_onSelectionChanged(e);
                        this.setState({
                            gridBoxValue: (e.selectedRowKeys.length && e.selectedRowKeys) || [],
                        });
                    }}
                    selectedRowKeys={this.state.gridBoxValue}
                    hoverStateEnabled={true}
                    height={"400px"}
                >
                    <HeaderFilter visible={true} />
                    <Selection mode={this.props.ModoSingleSelection ? "single" : "multiple"}/>
                    <Scrolling mode="infinite"/>
                    <Paging enabled={false} pageSize={10} />
                    <FilterRow visible={true} />

                    {this.props.children}
                    
                </DataGrid>
            </div>
        );
    }

    onContentReady(e) {
        let idComponenteGrid = this.state.idComponenteGrid;
        let columnIndexFocus = 0;

        //busco el input del filtro y le doy foco
        setTimeout(function () {
            try {
                document.getElementById(idComponenteGrid).querySelectorAll("input.dx-texteditor-input")[columnIndexFocus].focus();
            } catch (e) {
                //nada
            }
        }, 100);
    }

    gridBox_onOpened() {
        this.onContentReady();
    }

    gridBox_onKeyDown(e) {
        if (e.keyCode === 27) {
            this.gridBox_onClosed();
        }
    }

    cleanSelection(e) {
        this.setState({
          gridBoxValue: [],
        });
        // Seteo en vacio al componente padre
        this.dataGrid_onSelectionChanged(e); 
    }

    render() {

        return (
            <div >
                <DropDownBox
                    id={this.state.idComponenteCombo}
                    className={"dropDownBuscadores"}
                    valueExpr={this.props.keyExpr}
                    value={this.state.gridBoxValue.map(x => x[this.props.keyExpr])} //Valor es el id de los seleccionados
                    displayExpr={(e) => this.props.descripcionVisual(e)} // Se puede usar función o string con el nombre del campo
                    deferRendering={true}
                    showClearButton={true}
                    onOpened={this.gridBox_onOpened}
                    placeholder={this.props.placeholder}
                    dataSource={this.props.items}
                    contentRender={this.dataGridRender}
                    onValueChanged={this.cleanSelection}
                    width={"calc(50vw - 100px)"}
                >
                </DropDownBox>
            </div>
        );
    }
}