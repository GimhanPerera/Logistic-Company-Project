import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
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
import Swal from 'sweetalert2';
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
    const { orderId, fullname, status,tel_number,main_tracking_number} = location.state || {};
    const navigate = useNavigate();
    const { id } = useParams();

    const toBack = () => {
        navigate('../');
    }

    const [rows, setRows] = useState([]);

    const [rowModesModel, setRowModesModel] = useState({});
    const [displayMasks, setDisplayMasks] = useState(false);

    //supplier form data
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [tel, setTel] = useState("");
    const [des, setDes] = useState("");
    const [mainTracking, setMainTracking] = useState('');

    //get package data
    useEffect(() => {
        axios.get(`http://localhost:3001/api/package/getpackages/${orderId}`)
            .then((response) => {
                const dataWithIds = response.data.packages.map((item, index) => ({
                    ...item,
                    id: index+1 // Or use item.id if the data already has a unique identifier
                }));
                console.log("PKS", dataWithIds);
                setRows(dataWithIds);
                setMainTracking(response.data.tracking_number);
                console.log(mainTracking);
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
    const [tacking, setTacking] = useState(status);

    const handleTracking = (event) => {
        setTacking(event.target.value);
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
            field: 'warehouse_tracking_number',
            headerName: 'warehouse_tracking_number',
            width: 200,
            editable: true,
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
                if (response.status == 200) {
                    //Added successfully
                    Swal.fire({
                        title: "Packages added successfully",
                        //text: "That thing is still around?",
                        icon: "success"
                    });
                    setDisplayMasks(true);
                }
            })
            .catch((error) => {
                console.error("Error fetching details:", error);
                //setLoading(false);
            });

    }

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
                                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                                    <Select
                                        //defaultValue={30}
                                        value={tacking}
                                        label="Status"
                                        onChange={handleTracking}
                                    >
                                        <MenuItem value="Waiting">Waiting</MenuItem>
                                        <MenuItem value="In Warehouse">In Warehouse</MenuItem>
                                        <MenuItem value="Ship/airfreight ">Ship/airfreight</MenuItem>
                                        <MenuItem value="Customs">Customs</MenuItem>
                                        <MenuItem value="On hand">On hand</MenuItem>
                                        <MenuItem value="Ready">Ready</MenuItem>
                                        <MenuItem value="Deliverd">Deliverd</MenuItem>
                                    </Select>
                                </FormControl>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingTop: '0.7rem' }}>
                                <Button variant="contained"
                                    sx={{  }}
                                >
                                    Save Tracking details
                                </Button>
                            </td>
                            <td></td>
                        </tr>
                    </table>
                </Form>
            </Formik>

            <Button variant="contained" onClick={saveAllPackages} startIcon={<SaveIcon />} sx={{ backgroundColor: '#68DD62', position: 'fixed', right: '4rem', top: '5rem' }}>Save</Button>
            <Button variant="outlined" onClick={toBack} sx={{ position: 'fixed', right: '11rem', top: '5rem' }}>Back</Button>

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