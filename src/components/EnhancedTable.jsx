import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

let counter = 0;

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, multiSelectRow } = this.props;
        const cols = this.props.obtenerColumnas();

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        {
                            multiSelectRow === true ? <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        /> : null
                        }
                    </TableCell>
                    {cols.map(
                        col => (
                            <TableCell
                                key={col.id}
                                align={col.numeric ? 'right' : 'left'}
                                padding={col.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === col.id ? order : false}
                            >
                                <Tooltip
                                    title="Ordenar"
                                    placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={order}
                                        onClick={this.createSortHandler(col.id)}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    multiSelectRow: PropTypes.bool
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, titulo } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} Seleccionados
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {titulo}
                    </Typography>
                    )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <pre>
                        <Tooltip title="Borrar">
                            <IconButton aria-label="Borrar" onClick={() => { props.eliminar(props.selected()[0]) }}>
                                <DeleteIcon />
                            </IconButton>
                        
                        </Tooltip>
                        <Tooltip title="Editar">
                            <IconButton aria-label="Editar" onClick={() => { props.editar(props.selected()[0]) }}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </pre>
                ) : (
                        <Tooltip title="Filtrar Lista">
                            <IconButton aria-label="Filtrar Lista">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class EnhancedTable extends React.Component {

    state = {
        order: 'asc',
        orderBy: this.props.orderBy,
        selected: [],
        data: this.props.obtenerListado(),
        page: 0,
        rowsPerPage: 5,
    };
    

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        
        if (event.target.checked) {
            this.setState({
                selected: this.props.obtenerListado().map(n => eval(`n.${this.props.keyId}`))
            });
            return;
        }
        this.setState({ selected: [] });
    };

    deselecccionarTodos = () => { this.setState({ selected: []}) };

    setSelected = data => {
        this.setState({selected: data });
        this.props.selectedItem(data);
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const { multiSelectRow } = this.props;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        //checkeo multifila
        if (multiSelectRow === true) {
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1),
                );
            }
        } else {
            //solo checkeo de a una fila
            if (selectedIndex === 0) 
                newSelected = newSelected.concat(selected.slice(1));
            else
                newSelected = newSelected.concat(id);
        }

        this.setSelected(newSelected);
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    calcularAlineacion = key => {
        const columns = this.props.obtenerColumnas();
        return (columns.filter(col => col.id == key)[0].numeric ? "right" : "left");
    };

    render() {
        const { classes, obtenerColumnas, titulo } = this.props;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;

        const data = this.props.obtenerListado();
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        
        return (
            
            <Paper className={classes.root}>
                <EnhancedTableToolbar editar={() => this.props.editar(this.state.selected[0])} deselecccionarTodos={this.deselecccionarTodos} selected={() => this.state.selected}
                    eliminar={() => { this.props.eliminar(this.state.selected[0]); this.deselecccionarTodos(); }}
                    titulo={titulo} numSelected={selected.length} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                            obtenerColumnas={obtenerColumnas}
                            titulo={titulo}
                            multiSelectRow={this.props.multiSelectRow}
                        />
                        <TableBody>
                            {
                                stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const keyId = eval(`n.${this.props.keyId}`);
                                    const isSelected = this.isSelected(keyId);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, keyId)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={keyId}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            {/*<TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>*/}
                                            {Object.keys(n).map(key => {
                                                const value = eval("n." + key);
                                                return <TableCell key={key} align={this.calcularAlineacion(key)}>{value}</TableCell>
                                            })}
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Filas por Pagina"
                    labelDisplayedRows={(data) => `${data.from} - ${data.to} de ${data.count}`}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    obtenerListado: PropTypes.func.isRequired,
    obtenerColumnas: PropTypes.func.isRequired,
    selectedItem: PropTypes.func,
    titulo: PropTypes.string,
    orderBy: PropTypes.string.isRequired,
    keyId: PropTypes.string.isRequired,
    multiSelectRow: PropTypes.bool,
    eliminar: PropTypes.func,
};

export default withStyles(styles)(EnhancedTable);