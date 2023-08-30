/* eslint-disable linebreak-style */
import React, {useState} from "react";
import ComboBoxDropdown from "./ComboBox";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import "./PhoneNumberEl.css";

/**
 * Telephone input component.
 * @param {function} onSelectedValueChange - updates the phone number prefix on change event
 * @param {function} onInputValueChange - updates the remaining 7 digits of the phone number on change event
 * @param {String} comboBoxPlaceholder - placeholder for the prefix combobox.
 * @param {String} phoneInputPlaceholder - placeholder for the phone input field.
 * @param {String} variant - the vriant of the combobox(determines the color).
 * @return {React.Component} - The Telephone input component.
 */
function PhoneNumberEl({onSelectedValueChange, onInputValueChange, comboBoxPlaceholder, phoneInputPlaceholder, cbVariant}) {
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [phone, setPhone] = useState(phoneInputPlaceholder);
    const prefixArr = ["052", "054", "050", "053", "055"];

    const handleInputValueChange = (event) => {
        const newPhoneNum = event.target.value;
        onInputValueChange(event);
        setPhone(newPhoneNum);
        if (!/^\d{7}$/.test(newPhoneNum)) {
            setPhoneNumberError("Phone number should contain exactly 7 digits.");
        } else {
            setPhoneNumberError("");
        }
    };

    return (
        <>
            <div className="row-flex">
                <ComboBoxDropdown onSelectedValueChange={onSelectedValueChange} options={prefixArr} placeholder={comboBoxPlaceholder} variant={cbVariant} id="phone-cmb" /> {/* Your combobox component */}
                <div className="column-flex">
                    <Form.Control
                        className="telephone-input"
                        name="PhoneInputField"
                        type="number"
                        placeholder={phoneInputPlaceholder}
                        pattern="^\d{7}$"
                        title="Should contain exactly 7 digits"
                        onChange={handleInputValueChange}
                        value={phone}
                    />
                    <div className="text-danger">{phoneNumberError}</div>
                </div>
            </div>
        </>
    );
};

PhoneNumberEl.propTypes = {
    onSelectedValueChange: PropTypes.func.isRequired,
    onInputValueChange: PropTypes.func.isRequired,
    comboBoxPlaceholder: PropTypes.string.isRequired,
    phoneInputPlaceholder: PropTypes.string.isRequired,
    cbVariant: PropTypes.string.isRequired,
};

export default PhoneNumberEl;
