import React, { useState } from 'react';

const Spinner = (props) => (

    props.visible ?
        <React.Fragment>
            <div className="overlayView">
                <img className="img-responsive spinner" src={require('./../assets/img/images/tendor.gif')} />
            </div>
            <div className="overlayView1">
            </div>
        </React.Fragment>
        : null
)

export default Spinner;