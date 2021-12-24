import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TreeView from 'devextreme-react/tree-view';
import { MenuService } from '../services/MenuService';

export class MenuList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            treeView: {},
            items: [],
            usuarioId: this.props.childProps.usuarioId
        };

        this.renderItem = this.renderItem.bind(this);
        this.setItems = this.setItems.bind(this);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        //lleno los items del menu
        MenuService.listar(this.state.usuarioId, (data) => this.setItems(data));
    };

    setItems = function (data) {
        this.setState({ items: data });
    }

    calcularUrlImagen(data) {
        if (data.rutaImagen) {
            return `../images/${data.rutaImagen}`;
        }

        return '';
    }

    onMouseOver(e) {
        e.currentTarget.style.backgroundColor = e.currentTarget.dataset.colorover;
    }

    onMouseLeave(e) {
        e.currentTarget.style.backgroundColor = "transparent";
    }

    renderItem(data) {
        
        return (
            <ListItem data-colorover={data.backgroundColor} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave} style={{ padding: "10px", marginLeft: "0px" }} title={data.titulo} key={data.ruta}>
                <div style={{ height: "100%", width: "15px", backgroundColor: data.backgroundColor, display: "inline-block", position: "absolute", left: "0px" }}></div>
                <div style={{ height: "25px", width: "25px", marginLeft: "15px", display: "inline-block" }}>
                    {this.calcularUrlImagen(data) && <img style={{ height: "25px", width: "25px" }} src={this.calcularUrlImagen(data)} alt="" />}
                </div>
                <ListItemText style={{color: "white!important"}} primary={data.descripcion} />
            </ListItem>
        );
    }

    onOptionChanged(e) {
        if (e.value && e.value.querySelector) {
            var itemActual = e.value.querySelector("[data-colorover]");
            if (itemActual)
                itemActual.style.backgroundColor = itemActual.dataset.colorover;
        }

        if (e.previousValue && e.previousValue.querySelector) {
            var itemAnterior = e.previousValue.querySelector("[data-colorover]");
            if (itemAnterior)
                itemAnterior.style.backgroundColor = "rgb(27, 27, 27)";
        }
    }

    render() {
        return (
            <TreeView
                id={'mainMenu'}
                items={this.state.items}
                height={"calc(100% - 65px)"}
                dataStructure="tree"
                displayExpr={"descripcion"}
                searchMode={"contains"}
                searchTimeout={300}
                hoverStateEnabled={true}
                searchEnabled={true}
                onInitialized={e => this.setState({ treeView: e.component })}
                onOptionChanged={this.onOptionChanged}
                searchEditorOptions={{
                    name: "txtSearchMenu", onKeyDown: function (e) {
                        //flecha abajo
                        if (e.event.keyCode === 40) { 
                            e.event.preventDefault();
                            //le doy foco a los items del tree
                            document.querySelector("#mainMenu .dx-scrollable.dx-visibility-change-handler.dx-scrollable-vertical.dx-scrollable-simulated.dx-scrollable-customizable-scrollbars").focus();
                        }
                    }
                }}
                itemRender={this.renderItem}
                onItemClick={(e) => {
                    if(e.itemData.expanded === true)
                        e.component.collapseItem(e.itemData);
                    else
                        e.component.expandItem(e.itemData);

                    //si tengo una url valida
                    if (e.itemData.ruta !== "#") {
                        this.props.history.push(e.itemData.ruta);
                        this.props.setTitle(e.itemData.descripcion);
                    }
                }}
            />
        );
    }
}