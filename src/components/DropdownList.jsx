import React from "react";
import PropTypes from "prop-types";

const DropdownList = props => {
  return (
    <div className={props.wrapClass + " form-group newDropDwon"}>
      <select
        style={{ backgroundColor: 'white' }}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        className={
          "form-control " + (props.errorState === "error" ? "has-error" : "")
        }
        disabled={props.isDisabled}>
        {/* <option value="">{props.placeholder}</option> */}
        {props.options.map(option => {
          return (
            <option key={option.Id} value={option.Id} label={option.Name}>
              {option.Name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

DropdownList.propTypes = {
  heading: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.any.isRequired,
  placeholder: PropTypes.string.isRequired,
  errorState: PropTypes.string,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  wrapClass: PropTypes.string,
  isDisabled: PropTypes.bool
};

export default DropdownList;
