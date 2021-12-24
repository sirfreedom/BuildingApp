import  { PureComponent } from 'react';

export class Logout extends PureComponent {

    constructor (props) {
        super(props);

        //lo deslogueo
        const userHasAuthenticated = this.props.userHasAuthenticated;
        userHasAuthenticated({
            authenticated: false,
            usuarioId: null,
            clienteSasaId: null
        });

        this.props.history.replace("/");
    }

    render() {
        return null;
    }
}