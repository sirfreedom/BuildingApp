import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import DataGrid, {
    Scrolling,
    Editing,
    Paging,
    SearchPanel,
    Export,
    Grouping,
    ColumnChooser,
    GroupPanel, 
    LoadPanel,
    StateStoring,
    RowDragging
} from 'devextreme-react/data-grid';

export default class ADAGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            stateStoringEnabled: this.props.stateStoringEnabled !== undefined ? this.props.stateStoringEnabled : true ,
        };

        this.onContextMenuItems = this.onContextMenuItems.bind(this);
    }

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "header") {
            e.items.push(
                {
                    text: "Limpiar caché",
                    value: "clearCache",
                    onItemClick: () => {
                        //limpio la config guardada de la grilla
                        localStorage.setItem(`${window.location.pathname}_${this.props.keyExpr}`, null);
                        window.location.reload(true);
                    }
                }
            );
        }
    }

    render() {
        
        return (
            <Fragment>
                <DataGrid
                    dataSource={this.props.items}
                    keyExpr={this.props.keyExpr}
                    onEditCanceled={this.props.onEditCanceled}
                    onExporting={this.props.onExporting}
                    onCellPrepared={this.props.onCellPrepared}
                    onEditingStart={this.props.onEditingStart}
                    onEditorPrepared={this.props.onEditorPrepared}
                    onEditorPreparing={this.props.onEditorPreparing}
                    onInitialized={this.props.onInitialized}
                    onInitNewRow={this.props.onInitNewRow}
                    onRowInserting={this.props.onRowInserting}
                    onRowInserted={this.props.onRowInserted}
                    onRowPrepared={this.props.onRowPrepared}
                    onRowRemoving={this.props.onRowRemoving}
                    onRowRemoved={this.props.onRowRemoved}
                    onRowUpdated={this.props.onRowUpdated}
                    onRowUpdating={this.props.onRowUpdating}
                    onRowValidating={this.props.onRowValidating}
                    onSaved={this.props.onSaved}
                    onSaving={this.props.onSaving}
                    height={this.props.height !== undefined ? this.props.height : "calc(100vh - 70px)"}
                    width={this.props.width !== undefined ? this.props.width : "auto"}
                    onContextMenuPreparing={(e) => {
                        this.onContextMenuItems(e);
                        this.props.onContextMenuPreparing(e);
                    }}
                    filterRow={{
                        visible: this.props.enablefilterRow !== undefined ? this.props.enablefilterRow : false,
                        applyFilter: "auto"
                    }}
                    allowColumnReordering={true}
                    renderAsync={false} //no cambiar ya que sino funciona mal en modo popup
                    repaintChangesOnly={true}
                    keyboardNavigation={this.props.keyboardNavigation !== undefined
                        ? this.props.keyboardNavigation : {
                        editOnKeyPress: true,
                        enabled: true,
                        enterKeyAction: "moveFocus",
                        enterKeyDirection: "row"
                        }
                    }
                    hoverStateEnabled={true}
                    showColumnLines={true}
                    rowAlternationEnabled={false}
                    showBorders={true}
                    noDataText={this.props.noDataText !== undefined ? this.props.noDataText : "No hay información disponible."}
                    columnAutoWidth={this.props.columnAutoWidth !== undefined ? this.props.columnAutoWidth : false}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    onToolbarPreparing={this.props.onToolbarPreparing}
                    headerFilter={this.props.headerFilter !== undefined
                        ? this.props.headerFilter :
                        {
                            allowSearch: true,
                            visible: true
                        }
                    }
                    onKeyDown={obj => {
                        
                        if (obj.event.keyCode === 45) { //tecla insert
                            //agrego una nueva fila
                            obj.component.addRow();
                        }
                        else if (obj.event.altKey === true && obj.event.keyCode === 71) {//alt + g
                            //guardo los cambios
                            obj.component.saveEditData();
                        }
                    }}
                    >
                    <StateStoring enabled={this.state.stateStoringEnabled} storageKey={`${window.location.pathname}_${this.props.keyExpr}`} />
                    <Grouping contextMenuEnabled={true} autoExpandAll={this.props.autoExpandAll !== undefined ? this.props.autoExpandAll : false} />
                    <GroupPanel visible={this.props.groupPanel !== undefined ? this.props.groupPanel : true} />
                    <ColumnChooser enabled={this.props.columnChooser !== undefined ? this.props.columnChooser : true} />
                    <Scrolling mode={'virtual'} preloadEnabled={false} showScrollbar={"always"} useNative={true} />
                    <Paging enabled={false} />
                    <SearchPanel visible={this.props.searchEnabled !== undefined ? this.props.searchEnabled : true} highlightCaseSensitive={true} />
                    <Export enabled={this.props.exportEnabled !== undefined ? this.props.exportEnabled : true} />
                    <LoadPanel enabled={true} />
                    <Editing
                        confirmDelete={false}
                        mode={this.props.editingMode !== undefined ? this.props.editingMode : 'batch'}
                        allowUpdating={this.props.allowUpdating !== undefined ? this.props.allowUpdating : true}
                        allowAdding={this.props.allowAdding !== undefined ? this.props.allowAdding : true }
                        allowDeleting={this.props.allowDeleting !== undefined ? this.props.allowDeleting : true}
                        selectTextOnEditStart={true}
                        startEditAction="click">
                        {this.props.editingMode === "popup" && this.props.editorPopup !== undefined ? this.props.editorPopup() : null}
                        {this.props.editingMode === "popup" && this.props.editorForm !== undefined ? this.props.editorForm() : null}
                    </Editing>

                    <RowDragging />

                    {/*SERIAN LAS COLUMNAS*/}
                    {this.props.children}

                </DataGrid>
            </Fragment>
        )
    };
}

ADAGrid.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRowInserted: PropTypes.func,
    onRowUpdated: PropTypes.func,
    onRowRemoved: PropTypes.func,
    onEditingStart: PropTypes.func,
    onContextMenuPreparing: PropTypes.func,
    children: PropTypes.node.isRequired,
}