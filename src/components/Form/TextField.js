import { ErrorMessage, useField } from 'formik';
import React from 'react';

const TextField = ({...props}) => {

    const [field, meta] = useField(props)
    return (
        <div className="input-field">
            <input
            {...field} {...props}
            className={`form-control shadow-none mt-4 ${meta.touched && meta.error && 'is-invalid'}`}
            autoComplete="off"
             placeholder={props.placeholder}
             />
             <ErrorMessage component="div" name={field.name} style={{color: 'red'}}/>
        </div>
    );
};

export default TextField;