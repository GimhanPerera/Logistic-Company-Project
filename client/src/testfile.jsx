import { Field, Form, Formik, useFormik } from 'formik';
import React from 'react';
import { testValication } from './validations';

const initialVslues = {//Name attribute wala thiyena ewa
    name: '',
    email: '',
    password: '',
    cpassword: ''
}

export const TestFile = () => {

    // const {values, handleBlur, handleChange, handleSubmit, errors} = useFormik({
    //     initialValues: initialVslues,
    //     validationSchema: testValication,
    //     onSubmit: (values,e) => {
    //         console.log(values)
            
    //     }
    // })

    const {values, handleBlur, handleChange, handleSubmit, errors} = useFormik({
        onSubmit: (values,e) => {
            console.log(values)
            
        }
    })
    
    return (
        <div>
            {/*Normal way*/}
            {/* <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input type='text' name='name' 
                value={values.name}
                onBlur={handleBlur} 
                onChange={handleChange} />
                {errors.name && <small>{errors.name}</small>}
                <br />
                <label>Email</label>
                <input type='email' name='email' 
                value={values.email}
                onBlur={handleBlur} 
                onChange={handleChange}/>
                {errors.email && <small>{errors.email}</small>}
                <br />
                <label>password</label>
                <input type='text' name='password' 
                value={values.password}
                onBlur={handleBlur} 
                onChange={handleChange}/>
                <br />
                <label>Confirm password</label>
                <input type='text' name='cpassword' 
                value={values.cpassword}
                onBlur={handleBlur} 
                onChange={handleChange}/>
                <br />
                <button type='submit'>Submit</button>
            </form> */}

            {/*Easy and recommended way*/}
            <Formik
                initialValues= {initialVslues} 
                validationSchema= {testValication} 
            >
                {({errors, touched}) => (
                    <Form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <Field type='text' name='name'></Field>
                    {errors.name && touched.name ? <small>{errors.name}</small> : null}
                    <br />
    
                    <label>Email</label>
                    <Field type='text' name='email'></Field>
                    {errors.email && <small>{errors.email}</small>}
                    <br />
    
                    <label>password</label>
                    <Field type='text' name='password'></Field>
                    <br />
    
                    <label>Confirm password</label>
                    <Field type='text' name='cpassword'></Field>
                    <br />
                    <button type='submit'>Submit</button>
                </Form>
                )}
            
            </Formik>
        </div>
    )
}

//NOTE
//Name eke thiyena ekamai use karanna ona