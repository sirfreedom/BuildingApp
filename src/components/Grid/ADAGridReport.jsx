import React, { Fragment } from 'react';

import DataGrid, {
    Scrolling,
    Paging,
    SearchPanel,
    Export,
    Grouping,
    ColumnChooser,
    GroupPanel,
    LoadPanel,
    Selection
} from 'devextreme-react/data-grid';

export default class ADAGridReport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {

        return (
            <Fragment>
                <DataGrid
                    dataSource={this.props.items}
                    keyExpr={this.props.keyExpr}
                    height={"calc(100vh - 70px)"}
                    width={"calc(100vw - 120px)"}
                    allowColumnReordering={true}
                    hoverStateEnabled={true}
                    showColumnLines={true}
                    rowAlternationEnabled={false}
                    showBorders={true}
                    noDataText={""}
                    columnAutoWidth={true}
                    allowColumnResizing={true}

                    headerFilter={
                        {
                            allowSearch: true,
                            visible: true
                        }
                    }
                    >
                    <Grouping autoExpandAll={false} />
                    <GroupPanel visible={true} />
                    <ColumnChooser enabled={true} />
                    <Scrolling mode={'virtual'} columnRenderingMode={"virtual"} rowRenderingMode={"virtual"} showScrollbar={"always"} useNative={true} />
                    <Paging enabled={false} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Export enabled={true} />
                    <LoadPanel enabled={true} />
                    <Selection 
                        mode={'multiple'}
                        selectAllMode={'page'}
                        showCheckBoxesMode={'onClick'}
                    />
                    
                    {/*SERIAN LAS COLUMNAS*/}
                    {this.props.children}

                </DataGrid>

            </Fragment>

        )
    };

}
