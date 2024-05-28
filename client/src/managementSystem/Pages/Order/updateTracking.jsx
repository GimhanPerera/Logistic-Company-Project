import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes
} from '@mui/x-data-grid';
import axios from "axios";
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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


const UpdateTracking = () => {
    const location = useLocation();
    const { orderId, fullname, status, tel_number, main_tracking_number } = location.state || {};
    const navigate = useNavigate();
    const { id } = useParams();

    const toBack = () => {
        navigate('../');
    }

    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [displayMasks, setDisplayMasks] = useState(false);
    const [readyToShip, setReadyToShip] = useState(false);

    //check all packages are Received
    useEffect(() => {
        const allReceived = rows.every(row => row.status === "received");
        if (allReceived) {
            setReadyToShip(true);
        } else {
            setReadyToShip(false);
            setTracking("Waiting");
        }
    }, [rows]);

    //supplier form data
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [tel, setTel] = useState("");
    const [des, setDes] = useState("");
    const [mainTracking, setMainTracking] = useState('');
    const [localTrackingEditable, setlocalTrackingEditable] = useState(false);

    //get package data
    useEffect(() => {
        axios.get(`http://localhost:3001/api/package/getpackages/${orderId}`)
            .then((response) => {
                const dataWithIds = response.data.packages.map((item, index) => ({
                    ...item,
                    id: index + 1 // Or use item.id if the data already has a unique identifier
                }));
                console.log("PKS", dataWithIds);
                setRows(dataWithIds);
                setMainTracking(response.data.tracking_number);
                console.log(mainTracking);
                if (response.data.status == "Ready" || response.data.status == "Deliverd") {
                    setlocalTrackingEditable(true)
                }
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
    const [tracking, setTracking] = useState(status);

    const handleTracking = (event) => {
        setTracking(event.target.value);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 40, editable: false },
        {
            field: 'shipping_mark',
            headerName: 'Shipping mark',
            width: 170,
            editable: false,
        },
        {
            field: 'package_count',
            headerName: 'Package Count',
            width: 120,
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['not received', 'received'],
        },
        {
            field: 'warehouse_tracking_number',
            headerName: 'warehouse_tracking_number',
            width: 200,
            editable: true,
        },
        {
            field: 'local_tracking_number',
            headerName: 'local_tracking_number',
            width: 200,
            editable: localTrackingEditable,
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

    const setAllReceived = () => {
        const updatedRows = rows.map(row => ({ ...row, status: "received" }));
        setRows(updatedRows);
    };

    //Save all to database
    const saveAllPackages = async (e) => { //Submit the order
        e.preventDefault();
        //let SMdetails = [];
        //const supplierNames = Object.keys(groupedRows);
        rows.map((sName, index) => {
            console.log(sName.shipping_mark)
            console.log(sName.status)
        });
        const arrayOfObjects = rows.map((sName, index) => {
            return {
                shipping_mark: sName.shipping_mark,
                status: sName.status,
                warehouse_tracking_number: sName.warehouse_tracking_number,
                local_tracking_number: sName.local_tracking_number
            };
        });
        const data = {
            OrderID: orderId,
            status: tracking,
            packages: arrayOfObjects
        };
        const jsonString = JSON.stringify(data);
        console.log(jsonString);
        axios.post(`http://localhost:3001/api/order/updateTracking/${orderId}`,jsonString, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                //MASSAGES NEED TO TRIGER
                navigate('../');
            })
            .catch((error) => {
                console.error("Error fetching courier details:", error);
            });
    }

    const reloadPage = () => {
        window.location.reload();
    };

    //===========================================
    return (
        <>
            <Box component="h1" sx={{ textAlign: 'center', position: 'relative' }}>Order ID: {orderId}</Box>

            {/* Supplier form */}
            <Formik>
                <Form>
                    <table className="border-solid border-2 border-black m-2" style={{ border: 'solid 1px gray', margin: '1rem', padding: '1rem' }}>
                        <tr>
                            <td>
                                <TextField
                                    disabled
                                    label="Order ID"
                                    defaultValue={orderId}
                                />
                            </td>
                            <td>
                                <TextField
                                    disabled
                                    label="Name"
                                    defaultValue={fullname}
                                />
                            </td>
                            <td>
                                <TextField
                                    disabled
                                    label="Main Tracking number"
                                    defaultValue={main_tracking_number}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextField
                                    disabled
                                    label="Tel Number"
                                    defaultValue={tel_number}
                                />
                            </td>
                            <td>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="demo-select-small-label">Received status</InputLabel>
                                    <Select
                                        disabled={!readyToShip}
                                        value={tracking}
                                        label="Status"
                                        onChange={handleTracking}
                                    >
                                        <MenuItem value="Waiting">Waiting</MenuItem>
                                        <MenuItem value="In Warehouse">In Warehouse</MenuItem>
                                        {/* <MenuItem value="Ship/airfreight ">Ship/airfreight</MenuItem>
                                        <MenuItem value="Customs">Customs</MenuItem>
                                        <MenuItem value="On hand">On hand</MenuItem>
                                        <MenuItem value="Ready">Ready</MenuItem>
                                        <MenuItem value="Deliverd">Deliverd</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button variant="contained" onClick={reloadPage}>
                                    Undo all changes
                                </Button>
                            </td>
                            <td style={{ paddingTop: '0.7rem' }}>
                                <Button variant="contained" onClick={setAllReceived}>
                                    Set all packages as Received
                                </Button>
                            </td>
                        </tr>
                    </table>
                </Form>
            </Formik>

            <Button variant="contained" onClick={saveAllPackages} startIcon={<SaveIcon />} sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '4rem', top: '5rem' }}>Save</Button>
            <Button variant="outlined" onClick={toBack} sx={{ position: 'fixed', right: '11rem', top: '5rem' }}>Back</Button>

            {/*Table*/}
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


export default UpdateTracking