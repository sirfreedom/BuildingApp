import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import CssBaseline from '@material-ui/core/CssBaseline';
import classNames from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { MenuList } from './MenuList';

import { AccountService } from './../services/AccountService';

const drawerWidth = 400;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: -12,
        /*marginRight: 36,*/
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        width: "90px!important",
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        //width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9 + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        /*padding: theme.spacing.unit *3,*/
    },
});


class MenuAppBar extends React.Component {
    state = {
        anchorEl: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            title: ""
        };

        //voy al filtro de busqueda
        /*document.onkeydown = function (e) {
            if (e.keyCode === 220) { //tecla "°"
                e.preventDefault();
                document.getElementById("btnMenuDrawer").click();
                var input = document.querySelector("[name=txtSearchMenu]");
                input.select();
                input.focus();
            }

            if (e.keyCode === 27) { //tecla "escape"
                e.preventDefault();
                document.getElementById("btnCloseDrawer").click();
            }
        };*/

        this.logout = this.logout.bind(this);
    }

    setTitle = title => {
        this.setState({ title: title });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    logout = () => {
        const userHasAuthenticated = this.props.childProps.userHasAuthenticated;
        AccountService.logout(null, () => userHasAuthenticated({
            authenticated: false,
            usuarioId: null,
            clienteSasaId: null
        }));
    };

    render() {
        const { classes, theme } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar style={{ color: "white" }}
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: this.state.open,
                    })}
            >
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <IconButton 
                            id="btnMenuDrawer"
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, {
                                [classes.hide]: this.state.open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <Link style={{ color: "inherit", textDecoration: "none" }} to="/">Ada 5 Web</Link>
                            {this.state.title === "" ? null : <i> - {this.state.title}</i>}
                        </Typography>                        

                        {(
                            <div>
                                <IconButton 
                                    aria-owns={open ? 'menu-appbar' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handleClose}><Link to="/account">Mi Cuenta</Link></MenuItem>
                                    <MenuItem><Link onClick={this.logout} to="#">Cerrar Sesión</Link></MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
                <Drawer 
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: classNames("menuAppBar", {
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    open={this.state.open}
                >
                    <div className={classNames(classes.toolbar, "menuAppBarToolbar")}>
                        <IconButton onClick={this.handleDrawerClose} id="btnCloseDrawer">
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <MenuList setTitle={this.setTitle} {...this.props} />
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                        {this.props.children}
                </main>
            </div>
        );
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(MenuAppBar));