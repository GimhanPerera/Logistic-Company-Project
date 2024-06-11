import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    DataGrid,
    GridActionsCellItem,
    GridRowEditStopReasons,
    GridRowModes,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import axios from "axios";
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScanResultHandler from '../../../Modals/scanResultHandler';
import Autheader from "../../../services/Autheader";
import { scanPackagesValidation } from './../../../validations';

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

const ScanAndUpdate = () => {
    const location = useLocation();
    const { packages, totalPackageCount, totalCollectedCount } = location.state || {};
    const [scanResults, setScanResults] = useState([]);
    const [scanToggle, setScanToggle] = useState(false);
    const navigate = useNavigate();
    const [totalPackages, setTotalPackages] = useState(null);
    const [totalCollected, setTotalCollected] = useState(null);
    const [rowModesModel, setRowModesModel] = useState({});
    const [isSuccessScanOpen, setSuccessScanOpen] = useState(false);
    const [lastReading, setLastReading] = useState('');
    const [rows, setRows] = useState([]);
    // const initialValues = {
    //     id: packages.map((_, index) => index),
    //     shippingMark: packages.map(paks => paks.shipping_mark),
    //     count: packages.map(paks => paks.package_count),
    //     collectedCount: packages.map(paks => paks.collected_count),
    // }

    //----------------------------------------------
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
            await scanPackagesValidation.validate(newRow, { abortEarly: false });
            // Validate collectedCount against count
            if (newRow.collectedCount > newRow.count) {
                throw new Error("Collected Count cannot exceed Count");
            }
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
    //----------------------------------------------

    useEffect(() => {
        setTotalPackages(totalPackageCount);
        setTotalCollected(totalCollectedCount);
        //setRows(initialValues);
        //console.log(packages.length)
    }, [])
    useEffect(() => {
        // Map packages to rows with appropriate structure
        const initialRows = packages.map((pkg, index) => ({
            id: index, // Unique identifier
            shippingMark: pkg.shipping_mark,
            count: pkg.package_count,
            collectedCount: pkg.collected_count,
        }));

        setRows(initialRows);
    }, [packages]); // Include packages in dependencies array to trigger effect on change

    useEffect(() => {
        let scanner;
        if (scanToggle) {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
            });

            scanner.render(success, error);
        }

        function success(result) {
            scanner.clear();
            setScanResults(prevResults => [...prevResults, result]);
            // Navigate or handle the result as needed
            const reading = result.split(' ');
            //console.log(reading[0], rows);
            setLastReading(reading[0]);
            setScanToggle(!scanToggle);
            setSuccessScanOpen(true);
            console.log("Last Reading", lastReading);
        }

        function error(err) {
            console.warn(err);
        }

        // Cleanup function to stop the scanner when the component unmounts or scanToggle changes
        return () => {
            if (scanner) {
                scanner.clear().catch(err => console.warn('Failed to clear scanner', err));
            }
        };
    }, [scanToggle]);

    const toBack = () => {
        //console.log(rows);
        //setScanToggle(false);  // Stop the scanner
        navigate('./..');
    };

    const toScanAgain = () => {
        setScanToggle(!scanToggle);
    };

    const setAsAllCollected = () => {
        setTotalCollected(totalPackages);
        const updatedRows = rows.map(row => ({
            ...row,
            collectedCount: row.count // Assign collectedCount to count
        }));
        setRows(updatedRows);
    };

    //When the save button clicks
    const saveInDatabase = () => {
        //CODE HERE
        const token = localStorage.getItem('token');
        console.log(rows);
        axios.post('http://localhost:3001/api/shipment/saveScanUpdates', rows, {
            headers: {
                ...Autheader()
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

    const columns = [
        { field: 'id', headerName: 'ID', width: 80, editable: false },
        {
            field: 'shippingMark',
            headerName: 'Shipping Mark',
            width: 180,
            editable: false,
        }, {
            field: 'count',
            headerName: 'Count',
            width: 70,
            editable: false,
        }, {
            field: 'collectedCount',
            headerName: 'Collected Count',
            type: 'number',
            width: 130,
            editable: true,
        }, {
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


    return (
        <>
            <Box
                component='div'
                sx={{
                    width: '100%',
                    position: 'relative',
                    height: {
                        xs: '50px', // height 50px when the width is 600px or below
                        sm: 'auto' // auto height for larger screens
                    }
                }}
            >
                {/* Back button */}
                <Button variant='outlined' onClick={toBack} sx={{ position: 'absolute', ml: '50px' }} size='large'>Back</Button>
                {/* Save button */}
                <Button variant="contained" onClick={saveInDatabase} sx={{ position: 'absolute', right: '0', mr: '50px' }} size='large'>Save</Button>
            </Box>
            <Box component="div" sx={{}}>
                <div>
                    <Box component="h1" sx={{ textAlign: 'center' }}>Scan QR code</Box>
                    <Box component="h4" sx={{ textAlign: 'center' }}>Total packages: {totalPackages}</Box>
                    <Box component="h4" sx={{ textAlign: 'center' }}>Total collected count: {totalCollected}</Box>

                    {/* Button section and Scan section */}
                    <Box component="div" sx={{ width: '400px', margin: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div id='reader'></div>
                    </Box>

                    {/* {scanResults.length > 0 && (
                        <Box component="div">
                            <Box component="h2">Scan Results:</Box>
                            <ul>
                                {scanResults.map((result, index) => (
                                    <li key={index}>{result}</li>
                                ))}
                            </ul>
                        </Box>
                    )} */}
                    <Box component='div' sx={{ width: '200px', margin: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant='outlined' onClick={toScanAgain}>
                            {scanToggle ? 'Stop Scanner' : 'Start Scanning'}
                        </Button>
                        <br />
                        <Button variant='outlined' onClick={setAsAllCollected}>All collect</Button>
                    </Box>
                </div>
            </Box>
            <Container>

                {/* Table section */}
                <Box sx={{ height: 400, mb:'2rem'}}>
                    <StyledDataGrid sx={{ border: '1px solid gray', maxWidth:'600px', margin:'auto' }}
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
            <ScanResultHandler open={isSuccessScanOpen} lastReading={lastReading} rows={rows} setRows={setRows} onClose={() => setSuccessScanOpen(false)} />
        </>
    );
};

export default ScanAndUpdate;
