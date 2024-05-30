import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Box } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import React, { useRef } from 'react';

const PrintShippingMarks = ({printables,category}) => {

    const componentRef = useRef();


    return (
        <>
            {printables.map((packageMark, index) => (
                <Box component="div" className='container' key={index}>
                    {/* A shipping mark */}

                    <Box component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            mb: '0.5rem'
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
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>MARK</Box></td>
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>: {packageMark.smark.split(" ")[0]}</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>P/No</Box></td>
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>: {packageMark.smark.split(" ")[1]}</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>Category</Box></td>
                                        <td><Box component="h1" sx={{ fontSize: '2.5rem' }}>: {category}</Box></td>
                                    </tr>
                                    {packageMark.smark[6] === "A" ? (
                                        <tr>
                                            <td>
                                                <Box component="h1" sx={{ fontSize: '2.2rem' }}><CheckBoxOutlineBlankIcon sx={{ position: 'relative', top: '0.4rem', fontSize: '3.3rem', pt: '1rem' }} />SEA</Box>
                                            </td>
                                            <td>
                                                <Box component="h1" sx={{ fontSize: '2.2rem' }}><CheckBoxIcon sx={{ position: 'relative', top: '0.4rem', fontSize: '3.3rem', pt: '1rem' }} />AIR</Box>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td>
                                                <Box component="h1" sx={{ fontSize: '2.2rem' }}><CheckBoxIcon sx={{ position: 'relative', top: '0.4rem', fontSize: '3.3rem', pt: '1rem' }} />SEA</Box>
                                            </td>
                                            <td>
                                                <Box component="h1" sx={{ fontSize: '2.2rem' }}><CheckBoxOutlineBlankIcon sx={{ position: 'relative', top: '0.4rem', fontSize: '3.3rem', pt: '1rem' }} />AIR</Box>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </table>
                        </Box>
                        <Box component="div"
                            sx={{
                                border: '1px solid black',
                                padding: '40px 10px 10px 10px',
                                flexGrow: 1,
                            }}>
                            <QRCodeSVG size="135" value={packageMark.smark.split(" ")[0] + " " + packageMark.smark.split(" ")[1]} style={{ marginLeft: '1rem' }} />

                            {/* <table style={{ margin: 'auto' }}>
                                <tbody>

                                    <tr>
                                        <td><Box component="p">Length</Box></td>
                                        <td><Box component="p">: {packageMark.details.length}cm</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">Height</Box></td>
                                        <td><Box component="p">: {packageMark.details.height}cm</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">Width</Box></td>
                                        <td><Box component="p">: {packageMark.details.width}cm</Box></td>
                                    </tr>
                                    <tr>
                                        <td><Box component="p">VMW</Box></td>
                                        <td><Box component="p">: {packageMark.details.volume_metric_weight}kg</Box></td>
                                    </tr>
                                </tbody>
                            </table> */}
                        </Box>
                    </Box>
                </Box>
            ))}
        </>
    );
};

export default PrintShippingMarks;
