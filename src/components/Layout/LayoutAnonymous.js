import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Login } from '../../components/Account/Login';
import AppliedRoute from '../../components/AppliedRoute';
import CardContent from '@material-ui/core/CardContent';


export class LayoutAnonymous extends Component {
    static displayName = LayoutAnonymous.name;

    render() {
        
        const boxStyle = {
            display: "flex",
            flexDirection: "column",
            alignitems: "center",
            justifyContent: "center",
            maxWidth: "600px"
        }

    return (
        <div>
            <CardContent>
                <Container style={boxStyle}>
                    <AppliedRoute path='/' component={Login} props={this.props.childProps} />
                </Container>
            </CardContent>
        </div>
    );
  }
}

