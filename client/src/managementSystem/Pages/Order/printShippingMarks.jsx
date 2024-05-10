import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box } from '@mui/material';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

const printShippingMarks = () => {//{ order }

    const componentRef = useRef();

    // if (!order) {
    //     return null; // or handle the case where courier is undefined/null
    // }

    return (
        <Box component="div" className='container'>
            <h2>Shipping marks</h2>
            <ReactToPrint
                trigger={() => (
                    <button>Print/Download</button>
                )}
                content={() => componentRef.current}
                fileName="shipping_marks.pdf" // Set the default save name here
            />
            <Box component="div" sx={{ m: '10px 100px' }}>
                <Box component="div" ref={componentRef} className='motech' sx={{  m: '10px 10px' }}> {/*backgroundColor: 'yellow',*/}

                    {/* A shipping mark */}
                    <Box component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            mb:'0.5rem'
                        }}>
                        <Box component="div"
                            sx={{
                                border: '1px solid black',
                                padding: '20px',
                                flexGrow: 4
                            }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><Box component="h1" sx={{ fontSize: '3rem' }}>MARK</Box></td>
                                        <td><Box component="h1" sx={{ fontSize: '3rem' }}>: CFL397A-C5</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="h1" sx={{ fontSize: '3rem' }}>P/No</Box></td>
                                        <td><Box component="h1" sx={{ fontSize: '3rem' }}>: 1-2</Box></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Box component="h1" sx={{ fontSize: '2.9rem' }}><CheckBoxIcon sx={{ position: 'relative', top: '0.2rem', fontSize: '3.5rem', pt: '1rem' }} />SEA</Box>
                                        </td>
                                        <td>
                                            <Box component="h1" sx={{ fontSize: '2.9rem' }}><CheckBoxOutlineBlankIcon sx={{ position: 'relative', top: '0.2rem', fontSize: '3.5rem', pt: '1rem' }} />AIR</Box>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                        <Box component="div"
                            sx={{
                                border: '1px solid black',
                                padding: '20px',
                                flexGrow: 1,
                            }}>
                            <table style={{ margin: 'auto' }}>
                                <tbody>
                                    <tr>
                                        <td><Box component="p">Length</Box></td>
                                        <td><Box component="p">: 0.3m</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">Height</Box></td>
                                        <td><Box component="p">: 0.3m</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">Width</Box></td>
                                        <td><Box component="p">: 0.3m</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">Weight</Box></td>
                                        <td><Box component="p">: 1.23kg</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">VMW</Box></td>
                                        <td><Box component="p">: 1.23kg</Box></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                    
                </Box>
            </Box>
        </Box>
    );
};

export default printShippingMarks;
