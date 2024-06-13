import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Container, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import axios from "axios";
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { Countries } from '../../../countryCodes';
import { addPackageValidation } from './../../../validations';
import PrintShippingMarks from './printShippingMarks';
const initialVslues = {
  item: '',
  packages: '',
  shippingmethod: '',
  quotation: '',
  supplierLoc: '',
  cusID: '',
  name: '',
  tp: '',
}

//Table theme
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
      }`,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
      }`,
  },
  '& .MuiDataGrid-cell': {
    color:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
  },
  '& .MuiPaginationItem-root': {
    borderRadius: 0,
  },
  //...customCheckbox(theme),
}));

//Table tool buttons
function EditToolbar(props) {
  const { rows, setRows, setRowModesModel } = props;

  const handleClick = () => {
    const lastRowId = rows.length > 0 ? rows[rows.length - 1].id : 0;
    const id = parseInt(lastRowId) + 1;
    setRows((oldRows) => [...oldRows, { id, package_count: '', items: '', length: '', height: '', width: '', volume_metric_weight: '', gross_weight: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'items' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Package
      </Button>
    </GridToolbarContainer>
  );
}

export const Packages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { category, items, expectedPackageCount } = location.state || {};
  const toBack = () => {
    navigate('../');
  }

  const [rows, setRows] = useState([]);

  const [rowModesModel, setRowModesModel] = useState({});
  const [listOfSuppliers, setListOfSuppliers] = useState([]);
  const [displayMasks, setDisplayMasks] = useState(false);
  const [printables, setPrintables] = useState([]);
  const componentRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(Countries.find((country) => country.label === 'China'));

  //supplier form data
  const [name, setName] = useState("");
  //const [country, setCountry] = useState("");
  const [tel, setTel] = useState("");

  //get suppliers data
  useEffect(() => {
    axios.get("http://localhost:3001/api/supplier/foraddpackages")
      .then((response) => {
        setListOfSuppliers(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching courier details:", error);
      });
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      if (newRow.supplier == undefined) {
        toast.error("Please select a supplier");
        return
      }
      console.log("WADUNA", newRow);
      await addPackageValidation.validate(newRow, { abortEarly: false });
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      //console.log("Updated,")
      //console.log(updatedRow)
      return updatedRow;
    } catch (error) {
      // Handle validation errors
      toast.error(error.errors[0])
      console.error('Validation error:', error.errors);
      // You can also display error messages to the user
      throw error; // Rethrow the error to prevent row update
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  //READ FROM EXCEL SHEET------------------------
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleFileUpload = (e) => {
    try {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files[0]);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const lastRowId = rows.length > 0 ? rows[rows.length - 1].id : 0;
        const pid = parseInt(lastRowId) + 1;

        let newRows = [];
        let newRowModesModel = {};

        parsedData.forEach((item, index) => {
          const newRow = {
            id: index > 0 ? parseInt(newRows[index - 1].id) + pid : pid,
            package_count: item.package_count,
            items: item.items,
            length: item.length,
            height: item.height,
            width: item.width,
            volume_metric_weight: item.volume_metric_weight,
            gross_weight: item.gross_weight,
            isNew: true
          };

          newRows.push(newRow);
          newRowModesModel[newRow.id] = { mode: GridRowModes.Edit };
        });

        setRows((prevRows) => [...prevRows, ...newRows]);
        setRowModesModel((prevRowModesModel) => ({ ...prevRowModesModel, ...newRowModesModel }));
      };
    } catch (error) {
      toast.error(error.errors[0]);
      console.error('Validation error:', error.errors);
      throw error;
    }
  };

  //==============================================

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, editable: false },
    {
      field: 'items',
      headerName: 'Item(s)',
      width: 150,
      editable: true,
    },
    {
      field: 'package_count',
      headerName: 'Package Count',
      type: 'number',
      width: 115,
      editable: true,
    },

    {
      field: 'length',
      headerName: 'Length(cm)',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'height',
      headerName: 'Height(cm)',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'width',
      headerName: 'Width(cm)',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'volume_metric_weight',
      headerName: 'VMW',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'gross_weight',
      headerName: 'Gross Weight',
      type: 'number',
      width: 120,
      editable: true,
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      width: 140,
      editable: true,
      type: 'singleSelect',
      valueOptions: listOfSuppliers,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];


  //Grp the rowsbased on supplier, groupedRows is a objesct
  const groupedRows = rows.reduce((grouped, row) => {
    const supplier = row.supplier;
    if (!grouped[supplier]) {
      grouped[supplier] = [];
    }
    grouped[supplier].push(row);
    return grouped;
  }, {});

  //Add new supplier
  const addSupplier = async (e) => {
    if (!name || name.trim() === "") {
      toast.error("Supplier name is required");
      return;
    }
    const nameRegex = /^[a-zA-Z\s]+$/; // Regex pattern for English letters and spaces
    if (!nameRegex.test(name.trim())) {
      toast.error("Supplier name can only contain English letters");
      return;
    }

    if (!selectedCountry || !selectedCountry.label) {
      toast.error("Country is required");
      return;
    }

    const phoneRegex = /^\d{11}$/; // Regex pattern for exactly 11 digits
    if (!tel) {
      toast.error("Phone number is required");
      return;
    }
    if (!phoneRegex.test(tel)) {
      toast.error("Please enter valid Phone number");
      return;
    }

    //add the suppliers
    try {
      const response = await axios.post("http://localhost:3001/api/supplier", {
        name: name,
        country: selectedCountry.label,
        tel: tel,
      });
      console.log('Supplier added successfully:', response.data.new_supplier);
      toast.success("Supplier " + response.data.new_supplier + " added");
      // Create a new array with the added supplier using the spread operator
      const updatedList = [...listOfSuppliers, response.data.new_supplier];
      // Set the state to the updated array
      setListOfSuppliers(updatedList);

      //clear the input fields
      setName('');
      setSelectedCountry(Countries.find((country) => country.label === 'China'));
      setTel('');

    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  //Save all to database
  const saveAllPackages = async (e) => { //Submit the order
    e.preventDefault();
    if (rows.length == 0) {
      toast.error("Please insert package details");
      return;
    }
    const totalPackageCount = rows.reduce((total, row) => total + parseInt(row.package_count || 0), 0);
    console.log(`Total Package Count: ${totalPackageCount}`);
    if (totalPackageCount >= 100) {
      toast.error("Total package count in more than 100");
      return;
    }
    if (totalPackageCount !== expectedPackageCount) {
      const result = await Swal.fire({
        title: "Expected Package count and insert package count not match",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Continue"
      });

      // If the user did not confirm, return early
      if (!result.isConfirmed) {
        return;
      }
    }
    let SMdetails = [];
    const supplierNames = Object.keys(groupedRows);
    supplierNames.map((sName, index) => {
      const match = sName.match(/C0*(\d+)/);
      const attachableSName = `C${match[1]}`
      const rows = groupedRows[sName];
      const totalPackageCount = rows.reduce((total, row) => total + parseInt(row.package_count), 0);
      let newArray = [];


      rows.forEach(obj => {
        for (let i = 0; i < parseInt(obj.package_count); i++) {
          newArray.push(obj);
        }
      });

      for (let i = 1; i <= totalPackageCount; i++) {
        //console.log("SHIPPING MARK: " + id + "-" + attachableSName + " " + i + "-" + totalPackageCount);
        //console.log(newArray[i - 1]);
        const mark = id + "-" + attachableSName + " " + i + "-" + totalPackageCount;
        SMdetails.push({ smark: mark, details: newArray[i - 1] });
      }

    });
    console.log(SMdetails);

    axios.post("http://localhost:3001/api/package/addpackages", SMdetails)
      .then((response) => {
        //setTrackingDetails(response.data);
        //setLoading(false);
        console.log(response.data);
        if (response.status == 200) {
          //Added successfully
          Swal.fire({
            title: "Packages added successfully",
            //text: "That thing is still around?",
            icon: "success"
          });
          setPrintables(SMdetails);
          setDisplayMasks(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        //setLoading(false);
      });

  }
  //===========================================
  if (!displayMasks) { //Add packages
    return (
      <>
        <Box component="h1" sx={{ textAlign: 'center', position: 'relative' }}>Add packages</Box>
        <Box component="h3" sx={{ textAlign: 'center', position: 'relative' }}>Items: {items}</Box>
        <Box component="h3" sx={{ textAlign: 'center', position: 'relative' }}>Expected Package count: {expectedPackageCount}</Box>

        {/* SAVE btn */}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ ml: '20px' }}
        >
          Upload file
          <VisuallyHiddenInput type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        </Button>

        {/* Back btn */}
        {/* <Button variant="contained"
          sx={{ ml: '20px' }}
          onClick={toggleSupplier}
        >
          new Supplier
        </Button> */}

        {/* Supplier form */}
        <Formik
          initialValues={initialVslues}
        >
          <Form onSubmit={addSupplier}>
            <table className="border-solid border-2 border-black m-2" style={{ border: 'solid 1px gray', margin: '1rem', padding: '1rem' }}>
              <tr>
                <td><label for="name">Name :</label></td>
                <td><TextField type="text"
                  size='small'
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-solid border-2 border-blue-800" /></td>
              </tr>
              <tr>
                <td><label for="country">Country :</label></td>
                <td><Autocomplete
                  sx={{ width: 250, mt: 2, mb: 2 }}
                  options={Countries}
                  autoHighlight
                  defaultValue={selectedCountry}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.label} ({option.code})
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setSelectedCountry(newValue);
                  }}
                />
                </td>
              </tr>
              <tr>
                <td><label for="tp" style={{ marginRight: '1rem' }}>Tel. Number :</label></td>
                <td>
                  <TextField type="number"
                    size='small'
                    id="tp"
                    name="tp"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    className="border-solid border-2 border-blue-800" />
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '1rem' }}>
                  <Button variant="text"
                    sx={{ ml: '20px' }}
                  >
                    Cancel
                  </Button>
                </td><td style={{ paddingTop: '1rem' }}>
                  <Button variant="contained"
                    sx={{ ml: '20px' }}
                    onClick={addSupplier}
                  >
                    Add new supplier
                  </Button>
                </td>
              </tr>
            </table>
          </Form>
        </Formik>

        <Button variant="contained" onClick={saveAllPackages} startIcon={<SaveIcon />} sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '4rem', top: '5rem' }}>Save</Button>
        <Button variant="outlined" onClick={toBack} sx={{ position: 'fixed', right: '11rem', top: '5rem' }}>Back</Button>

        <Container>
          <Box sx={{ height: 400, width: '1100px' }}>
            <StyledDataGrid sx={{ border: '1px solid gray' }}
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: EditToolbar,
              }}
              slotProps={{
                toolbar: { rows, setRows, setRowModesModel },
              }}
            />
          </Box>
        </Container>
        <ToastContainer />
      </>
    )
  }
  else { //Display shipping marks
    return (
      <>
        <h2 style={{textAlign:'center', marginBottom:'1rem', fontSize:'2rem'}}>Shipping marks</h2>
        {/* Back btn */}
        <Button variant="contained"
          sx={{ ml: '20px' }}
          onClick={toBack}
        >
          Back
        </Button>

        {/*Print btn*/}
        <ReactToPrint
          trigger={() => (
            <Button
              component="label"
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{ ml: '20px' }}
            >
              Print / Download
            </Button>
          )}
          content={() => componentRef.current}
          fileName="shipping_marks.pdf" // Set the default save name here
        />
        <Box component="div" sx={{ m: '10px 100px' }}>
          <Box component="div" ref={componentRef} className='motech' sx={{ m: '10px 10px' }}> {/*backgroundColor: 'yellow',*/}

            <PrintShippingMarks printables={printables} category={category}></PrintShippingMarks>

          </Box>
        </Box>

      </>
    )
  }
}


