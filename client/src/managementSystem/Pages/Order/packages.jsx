import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from "xlsx";
import { addPackageValidation } from './../../../validations';

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
    setRows((oldRows) => [...oldRows, { id, package_count: '', items: '', length: '', height: '', width: '', weight: '', volume_metric_weight: '', gross_weight: '', isNew: true }]);
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
  const toBack = () => {
    navigate('../');
  }
  useEffect(() => {
    // axios.post("http://localhost:3001/api/order/trackorder", {
    //     "tracking_id": id
    // })
    //     .then((response) => {
    //         console.log("This is the ID: " + id)
    //         setTrackingDetails(response.data);
    //         setLoading(false);
    //         console.log(response.data);
    //     })
    //     .catch((error) => {
    //         console.error("Error fetching courier details:", error);
    //         setLoading(false);
    //     });
    console.log("OrderID: " + id)
  }, []);



  const [rows, setRows] = useState([
    {
      "id": "1",
      "package_count": "1",
      "items": "Phone covers",
      "supplier": "C001-Chanli china",
      "length": "23",
      "height": "23",
      "width": "12",
      "weight": "12.3",
      "volume_metric_weight": "123.4",
      "gross_weight": "1233",
    }, {
      "id": "2",
      "package_count": "2",
      "items": "Toys",
      "supplier": "C001-Chanli china",
      "length": "42",
      "height": "12",
      "width": "65",
      "weight": "32.3",
      "volume_metric_weight": "633.4",
      "gross_weight": "222",
    }
  ]);

  const [rowModesModel, setRowModesModel] = React.useState({});
  const [listOfSuppliers, setListOfSuppliers] = useState([])

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
      await addPackageValidation.validate(newRow, { abortEarly: false });
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      //console.log("Updated,")
      //console.log(updatedRow)
      return updatedRow;
    } catch (error) {
      // Handle validation errors

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
      parsedData.map((item, index) => (
        setRows(prevRows => [
          ...prevRows,
          {
            "id": index > 0 ? parseInt(prevRows[index - 1].id) + pid : pid,//index > 0 ? parseInt(prevRows[index - 1].id) + pid : 1,
            "package_count": item.package_count,
            "items": item.items,
            "length": item.length,
            "height": item.height,
            "width": item.width,
            "weight": item.weight,
            "volume_metric_weight": item.volume_metric_weight,
            "gross_weight": item.gross_weight,
            isNew: true
          }
        ])
      ))
      console.log(parsedData[0].name)
    }
  }
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
      width: 115,
      editable: true,
    },

    {
      field: 'length',
      headerName: 'Length',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'height',
      headerName: 'Height',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'width',
      headerName: 'Width',
      type: 'number',
      width: 95,
      editable: true,
    },
    {
      field: 'weight',
      headerName: 'Weight',
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



  //Save all to database
  const saveAllPackages = async (e) => { //Submit the order
    e.preventDefault();
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
        if(response.status==200){
          //Added successfully
          toBack()
        }
      })
      .catch((error) => {
        console.error("Error fetching details:", error);
        setLoading(false);
      });

  }
  //===========================================
  return (
    <>
      <Box component="h1" sx={{ textAlign: 'center' }}>Add packages</Box>

      {/* <input
        type='file'
        accept='.xlsx, .xls'
        onChange={handleFileUpload}
      /> */}
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

      {/*OLD TABLE: SAVE TO DELETE*/}
      <div className='w-full'>
        <div className="relative overflow-x-auto">
          <table className='w-full text-sm text-left rtl:text-right text-gray-900'>
            <thead className='text-xs text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white'>
              <tr className='w-9/12 border border-opacity-100 '>
                <td className='px-6 py-3'>package_count</td>
                <td className='px-6 py-3'>Items</td>
                <td className='px-6 py-3'>length</td>
                <td className='px-6 py-3'>height</td>
                <td className='px-6 py-3'>width</td>
                <td className='px-6 py-3'>weight</td>
                <td className='px-6 py-3'>volume_metric_weight</td>
                <td className='px-6 py-3'>gross_weight</td>

              </tr>
            </thead>
            <tbody>
              {rows &&
                rows.map(item => (
                  <tr key={item.id} className='text-center'>
                    <td>{item.package_count}</td>
                    <td>{item.items}</td>
                    <td>{item.length}</td>
                    <td>{item.height}</td>
                    <td>{item.width}</td>
                    <td>{item.weight}</td>
                    <td>{item.volume_metric_weight}</td>
                    <td>{item.gross_weight}</td>

                    <td>
                      <a className='cursor-pointer mr-1' >Edit</a>
                      <a className='cursor-pointer mr-1' >Remove</a>
                      <a className='cursor-pointer mr-1'>details</a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      <Button variant="contained" onClick={saveAllPackages} startIcon={<SaveIcon />} sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '4rem', top: '5rem' }}>Save</Button>
      <Button variant="contained" onClick={toBack} sx={{}}>Back</Button>

      <Container>
        <Box sx={{ height: 400, width: '90%' }}>
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
    </>
  )
}


