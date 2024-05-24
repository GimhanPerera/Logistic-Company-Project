import { Box, Button } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScanAndUpdate = () => {
    const [scanResults, setScanResults] = useState([]);
    const [scanToggle, setScanToggle] = useState(false);
    const navigate = useNavigate();

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
        setScanToggle(false);  // Stop the scanner
        navigate('./..');
    };

    const toScanAgain = () => {
        setScanToggle(!scanToggle);
    };

    return (
        <Box component="div" sx={{}}>
            <div>
                <Box component="h1">Scan QR code</Box>
                <Box component="div" sx={{ width: '400px' }}>
                    <div id='reader'></div>
                </Box>
                {scanResults.length > 0 && (
                    <Box component="div">
                        <Box component="h2">Scan Results:</Box>
                        <ul>
                            {scanResults.map((result, index) => (
                                <li key={index}>{result}</li>
                            ))}
                        </ul>
                    </Box>
                )}
                <Button onClick={toScanAgain}>
                    {scanToggle ? 'Stop Scanner' : 'Scan Again'}
                </Button>
                <Button onClick={toBack}>Back</Button>
            </div>
        </Box>
    );
};

export default ScanAndUpdate;
