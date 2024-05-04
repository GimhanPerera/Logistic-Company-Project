import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as XLSX from "xlsx";
import EditPackageModal from '../../../Modals/editPackageModal';
import { addPackageValidation } from './../../../validations';

export const Packages = () => {
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [tableData, setTableData] = useState([
    {
      "s_mark": "1",
      "items": "Phone covers",
      "length": "23",
      "height": "23",
      "width": "12",
      "weight": "12.3",
      "volume_metric_weight": "123.4",
      "gross_weight": "1233",
    }, {
      "s_mark": "2",
      "items": "Toys",
      "length": "42",
      "height": "12",
      "width": "65",
      "weight": "32.3",
      "volume_metric_weight": "633.4",
      "gross_weight": "222",
    }
  ]);
  // <td>Shipping Mark</td>
  // <td>Items</td>
  // <td>length</td>
  // <td>height</td>
  // <td>width</td>
  // <td>weight</td>
  // <td>volume_metric_weight</td>
  // <td>gross_weight</td>
  const [btn, setBtn] = useState('Add');
  const clearForm = () => {
    setBtn('Add');
  }

  //--------------------------------------------

  const onSubmit = async (values, actions) => { //Submition here
    alert("Submitted: "+values.s_mark)
    //e.preventDefault()
    if (!values.s_mark || !values.items) {
      // If any field is empty, return early
      return;
    }
    if (btn == 'Edit') {
      // Find the index of the item with the specified id
      const index = tableData.findIndex(item => item.s_mark === values.s_mark);

      // If the item is found
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
          gross_weight: values.gross_weight,
        };

        // Set the updated tableData array
        setTableData(updatedTableData);
      }
      actions.resetForm(); //Reset the form
      return
    }
    setTableData(prevTableData => [
      ...prevTableData,
      {
        "s_mark": values.s_mark,
        "items": values.items,
        "length": values.length,
        "height": values.height,
        "width": values.width,
        "weight": values.weight,
        "volume_metric_weight": values.volume_metric_weight,
        "gross_weight": values.gross_weight,
      }
    ]);
    actions.resetForm(); //Reset the form
  }

  //Formik initiation
  const {values,touched, handleBlur,isSubmitting,  handleChange, handleSubmit, errors} = useFormik({
    initialValues :{
      s_mark: '',
      items: '',
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

//--------------------------------------------

//Edit package
const editPackage = (s_mark) => {
  setNumber(s_mark);
  setEditIsOpen(true);
};

//Remove package
const removePackage = (s_mark) => {
  const updatedTableData = tableData.filter(item => item.s_mark !== s_mark);
  //SHipping mark wenas wenna one
  setTableData(updatedTableData);
};

  //READ FROM EXCEL SHEET------------------------
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      parsedData.map(item => (
        setTableData(prevTableData => [
          ...prevTableData,
          {
            "s_mark": item.s_mark,
            "items": item.items,
            "length": item.length,
            "height": item.height,
            "width": item.width,
            "weight": item.weight,
            "volume_metric_weight": item.volume_metric_weight,
            "gross_weight": item.gross_weight,
          }
        ])
      ))
      console.log(parsedData[0].name)
    }
  }
  //------------------------

  return (
    <>
      <input
        type='file'
        accept='.xlsx, .xls'
        onChange={handleFileUpload}
      />

      <div className='w-full'>
        {/* add a package */}
        <form onSubmit={handleSubmit}>
          <p>Add packages</p>
          <label>s_mark</label>
          <input
            type='text'
            name='s_mark'
            value={values.s_mark}
            onChange={handleChange}
            id="s_mark"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.s_mark && touched.s_mark ? <small>{errors.s_mark}</small> : null}<br/>
          <label>items</label>
          <input
            type='text'
            name='items'
            value={values.items}
            onChange={handleChange}
            id="items"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.items && touched.items ? <small>{errors.items}</small> : null}<br/>
          <label>Age</label>
          <input
            type='text'
            name='length'
            value={values.length}
            onChange={handleChange}
            id="length"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.length && touched.length ? <small>{errors.length}</small> : null}<br/>
          <label>height</label>
          <input
            type='text'
            name='height'
            value={values.height}
            onChange={handleChange}
            id="height"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.height && touched.height ? <small>{errors.height}</small> : null}<br/>
          <label>width</label>
          <input
            type='text'
            name='width'
            value={values.width}
            onChange={handleChange}
            id="width"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.width && touched.width ? <small>{errors.width}</small> : null}<br/>
          <label>weight</label>
          <input
            type='text'
            name='weight'
            value={values.weight}
            onChange={handleChange}
            id="weight"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.weight && touched.weight ? <small>{errors.weight}</small> : null}<br/>
          <label>volume_metric_weight</label>
          <input
            type='text'
            name='volume_metric_weight'
            value={values.volume_metric_weight}
            onChange={handleChange}
            id="volume_metric_weight"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.volume_metric_weight && touched.volume_metric_weight ? <small>{errors.volume_metric_weight}</small> : null}<br/>
          <label>gross_weight</label>
          <input
            type='text'
            name='gross_weight'
            value={values.gross_weight}
            onChange={handleChange}
            id="gross_weight"
            onBlur={handleBlur}
            className="border-solid border-2 border-blue-800" />
          {errors.gross_weight && touched.gross_weight ? <small>{errors.gross_weight}</small> : null}<br/>

          <button type='submit' className='bg-lime-600'>{btn}</button>
          <button onClick={clearForm}>Clear</button>
        </form>
        <div className="relative overflow-x-auto">
          <table className='w-full text-sm text-left rtl:text-right text-gray-900'>
            <thead className='text-xs text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white'>
              <tr className='w-9/12 border border-opacity-100 '>
                <td className='px-6 py-3'>Shipping Mark</td>
                <td className='px-6 py-3'>Items</td>
                <td className='px-6 py-3'>length</td>
                <td className='px-6 py-3'>height</td>
                <td className='px-6 py-3'>width</td>
                <td className='px-6 py-3'>weight</td>
                <td className='px-6 py-3'>volume_metric_weight</td>
                <td className='px-6 py-3'>gross_weight</td>

                {/* <td>local_tracking_number</td>
              <td>warehouse_tracking_number</td>
              <td>gross_weight</td>
              <td>chargable_weight</td>
              <td>collected_date_time</td>
              <td>rate</td>
              <td>tax</td>
              <td>total</td> */}
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.map(item => (
                  <tr key={item.id} className='text-center'>
                    <td>{item.s_mark}</td>
                    <td>{item.items}</td>
                    <td>{item.length}</td>
                    <td>{item.height}</td>
                    <td>{item.width}</td>
                    <td>{item.weight}</td>
                    <td>{item.volume_metric_weight}</td>
                    <td>{item.gross_weight}</td>

                    <td>
                      <a className='cursor-pointer mr-1' onClick={() => editPackage(item.s_mark)}>Edit</a>
                      <a className='cursor-pointer mr-1' onClick={() => removePackage(item.s_mark)}>Remove</a>
                      <a className='cursor-pointer mr-1'>details</a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <EditPackageModal open={isEditOpen} onClose={() => setEditIsOpen(false)} tableData={tableData} setTableData={setTableData} number={number}/>
      
    </>
  )
}
