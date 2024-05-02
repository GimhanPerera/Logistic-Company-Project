import { useFormik } from 'formik';
import React from 'react';
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
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                <h4 className='text-3xl font-bold'>Add Customer</h4><hr className='h-1 mt-2 mb-2' />

                    <form onSubmit={handleSubmit} autoComplete="off">
                        
                                <label>First name :</label>
                                <input 
                                        type='text' 
                                        name='f_name' 
                                        value={values.f_name} 
                                        onChange={handleChange} 
                                        id="f_name" 
                                        onBlur={handleBlur} 
                                        className="border-solid border-2 border-blue-800" />
                                        {errors.f_name && touched.f_name ? <small>{errors.f_name}</small> : null}
                                
                            <br/>
                                <label>Last name :</label>
                                <input type='text' name='l_name' value={values.l_name} onChange={handleChange} id="l_name" onBlur={handleBlur} className="border-solid border-2 border-blue-800" />
                                {errors.l_name && touched.l_name ? <small>{errors.l_name}</small> : null}
                                <br/>
                                <label>Tel. Number :</label>
                                <input type='text' name='tel_number' value={values.tel_number} onChange={handleChange} id="tel_number" onBlur={handleBlur} className="border-solid border-2 border-blue-800" />
                                {errors.tel_number && touched.tel_number ? <small>{errors.tel_number}</small> : null}
                            
                        
                        <button type='submit' disabled={isSubmitting} className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Submit</button><br />
                        
                    </form>


            </div>


        </>
    )
}