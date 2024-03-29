﻿import React from "react";
import { Route } from "react-router-dom";

const appliedRoute = ({ component: C, props: cProps, ...rest }) =>
    <Route {...rest} render={props => <C {...props} {...cProps} />} />;

export default appliedRoute;