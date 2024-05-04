//Formik but not submit
import { useFormik } from 'formik';
import React from 'react';
import { addPackageValidation } from '../validations';


export default function EditPackageModal({ open, onClose, tableData, setTableData, number }) {

    const onSubmit = async (values, actions) => { //Submition here
        const index = tableData.findIndex(item => item.id === id);
        if (index !== -1) {
            // Create a new array to hold the updated tableData
            const updatedTableData = [...tableData];

            // Update the properties of the item
            updatedTableData[index] = {
                ...updatedTableData[index], // Keep other properties unchanged
                s_mark: values.s_mark,
                items: values.items,
                length: values.length,
                height: values.height,
                width: values.width,
                weight: values.weight,
                volume_metric_weight: values.volume_metric_weight,
                gross_weight: values.gross_weight
            };

            // Set the updated tableData array
            setTableData(updatedTableData);
        }

        actions.resetForm(); //Reset the form
    }
    const { values, touched, handleBlur, isSubmitting, setErrors, handleChange, handleSubmit, errors } = useFormik({
        initialValues: {
            s_mark: tableData[number],
            items: 'sdsd',
            length: '',
            height: '',
            width: '',
            weight: '',
            volume_metric_weight: '',
            gross_weight: '',
        },
        validationSchema: addPackageValidation,
        onSubmit,
    });

    const handleClose = (e) => {
        if (e.target.id === 'container') {
            onClose();
            setErrors({})
            actions.resetForm();
        }
    }
    const clickCloseBtn = () => {
        onClose();
        setErrors({})
        actions.resetForm();
    }


    if (!open) return null;
    return (
        <>
            {/*Card*/}
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 z-50'>
                <h4 className='text-3xl font-bold'>Edit Package details</h4><hr className='h-1 mt-2 mb-2' />

                <form onSubmit={handleSubmit}>
                    <table>
                        <tr>
                            <td><label>S_mark :</label></td>
                            <td><input
                                type='text'
                                name='s_mark'
                                value={values.s_mark}
                                onChange={handleChange}
                                id="s_mark"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.s_mark && touched.s_mark ? <small className="text-red-700 pl-1">{errors.s_mark}</small> : null}</tr>

                        <tr>
                            <td><label>Items :</label></td>
                            <td><input
                                type='text'
                                name='items'
                                value={values.items}
                                onChange={handleChange}
                                id="items"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.items && touched.items ? <small className="text-red-700 pl-1">{errors.items}</small> : null}</tr>
                        <tr>
                            <td><label>length :</label></td>
                            <td><input
                                type='text'
                                name='length'
                                value={values.length}
                                onChange={handleChange}
                                id="length"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.length && touched.length ? <small className="text-red-700 pl-1">{errors.length}</small> : null}</tr>
                        <tr>
                            <td><label>height :</label></td>
                            <td><input
                                type='text'
                                name='height'
                                value={values.height}
                                onChange={handleChange}
                                id="height"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.height && touched.height ? <small className="text-red-700 pl-1">{errors.height}</small> : null}</tr>
                        <tr>
                            <td><label>width :</label></td>
                            <td><input
                                type='text'
                                name='width'
                                value={values.width}
                                onChange={handleChange}
                                id="width"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.width && touched.width ? <small className="text-red-700 pl-1">{errors.width}</small> : null}</tr>
                        <tr>
                            <td><label>NIC :</label></td>
                            <td><input
                                type='text'
                                name='weight'
                                value={values.weight}
                                onChange={handleChange}
                                id="weight"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.weight && touched.weight ? <small className="text-red-700 pl-1">{errors.weight}</small> : null}</tr>
                        <tr>
                            <td><label>VMW :</label></td>
                            <td><input
                                type='text'
                                name='weight'
                                value={values.volume_metric_weight}
                                onChange={handleChange}
                                id="volume_metric_weight"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.volume_metric_weight && touched.volume_metric_weight ? <small className="text-red-700 pl-1">{errors.volume_metric_weight}</small> : null}</tr>
                        <tr>
                            <td><label>Gross weight :</label></td>
                            <td><input
                                type='text'
                                name='gross_weight'
                                value={values.gross_weight}
                                onChange={handleChange}
                                id="gross_weight"
                                onBlur={handleBlur}
                                className="border-solid border-2 border-blue-800" /></td>
                            {errors.gross_weight && touched.gross_weight ? <small className="text-red-700 pl-1">{errors.gross_weight}</small> : null}</tr>
                    </table>
                    <button type='submit' className='mt-2 bg-[#1E90FF] text-white w-full p-2 rounded-3xl border-solid border-1 border-[#1E90FF]'>Submit</button><br />
                    <button onClick={clickCloseBtn} className='mt-2 bg-[#feffff] text-[#1E90FF] w-full p-2 rounded-lg'>Cancel</button>
                </form>

            </div>

            {/*Background*/}
            <div
                id='container' onClick={handleClose}
                className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40'
            />
        </>
    )
}

//NOTE
//textarea and paragragh width make the card width
