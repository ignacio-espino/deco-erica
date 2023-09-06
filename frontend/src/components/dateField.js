import esLocale from "date-fns/locale/es";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {TextField} from "@mui/material";
import * as React from "react";
import PropTypes from 'prop-types';


export default class DateField extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        views: PropTypes.object,
        disabled: PropTypes.bool,
        onDateSelected: PropTypes.func,
    };

    static defaultProps = {
        renderInput: (params)=>(<TextField {...params} />),
        onDateSelected: () => {},
        disabled: false,
        mask: '__/__/____',
    }

    render() {
        const {onDateSelected, ...otherProps} = this.props;

        return (
            <div className={this.props.className} style={this.props.style}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                    <DatePicker {...otherProps}
                                onChange={(date) => onDateSelected(date)}
                    />
                </LocalizationProvider>
            </div>
        )
    }
}
