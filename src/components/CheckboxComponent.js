import React from 'react';
import PropTypes from 'prop-types';

const CheckboxComponent = ({ type = 'checkbox', name, className, checked = false, onChange }) => (
    <input type={type} className={className} name={name} checked={checked} onChange={onChange} />
);

CheckboxComponent.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
}

export default CheckboxComponent;