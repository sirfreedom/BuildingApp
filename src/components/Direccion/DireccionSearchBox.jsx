import React from "react";
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs } = require("react-google-maps");
const {
    StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export const DireccionSearchBox = compose(
    withProps({
        googleMapURL:
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyDJqZTwIOTwpc8WzAlodtpkIdM4LZ12q6E&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />
    }),
    lifecycle({
        componentWillMount() {
            const refs = {};

            this.setState({
                places: [],
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onPlacesChanged: () => {
                    this.props.onPlacesChanged(refs.searchBox.getPlaces());
                }
            });
        }
    }),
    withScriptjs
)(props => (
    <div data-standalone-searchbox="">
        <StandaloneSearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder="Ingrese la dirección"
                autoFocus
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `50%`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`
                }}
            />
        </StandaloneSearchBox>
        <hr/>
    </div>
    ));