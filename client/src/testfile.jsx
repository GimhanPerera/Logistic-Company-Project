import { useFormik } from 'formik';
import React from 'react';
import './testfile.css';
import { testValication } from './validations';


export const TestFile = () => {
    const onSubmit = async (values, actions) => { //Submition here
        alert("Submitted: "+values.f_name)
        //values.f_name : value of f_name
        actions.resetForm(); //Reset the form
    }


    const {values,touched, handleBlur,isSubmitting,  handleChange, handleSubmit, errors} = useFormik({
        initialValues :{
            f_name: '',
            l_name: '',
            tel_number: '',
        },
        validationSchema: testValication,
        onSubmit,
    });

    

    return (
        <>
            {/*Card*/}
            <div id='testdev'>
                <h4 id='testdev-h4'>Add Customer</h4><hr id='rule' />

                    <form onSubmit={handleSubmit} autoComplete="off">
                        
                                <label>First name :</label>
                                <input 
                                        type='text' 
                                        name='f_name' 
                                        value={values.f_name} 
                                        onChange={handleChange} 
                                        id="f_name" 
                                        onBlur={handleBlur} 
                                         />
                                        {errors.f_name && touched.f_name ? <small>{errors.f_name}</small> : null}
                                
                            <br/>
                                <label>Last name :</label>
                                <input type='text' name='l_name' value={values.l_name} onChange={handleChange} id="l_name" onBlur={handleBlur}  />
                                {errors.l_name && touched.l_name ? <small>{errors.l_name}</small> : null}
                                <br/>
                                <label>Tel. Number :</label>
                                <input type='text' name='tel_number' value={values.tel_number} onChange={handleChange} id="tel_number" onBlur={handleBlur}  />
                                {errors.tel_number && touched.tel_number ? <small>{errors.tel_number}</small> : null}
                            
                        
                        <button type='submit' disabled={isSubmitting} className='btn'>Submit</button><br />
                        
                    </form>


            </div>


        </>
    )
}