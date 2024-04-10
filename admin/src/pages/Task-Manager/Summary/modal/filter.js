import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { Modal, Row, Col, Button, Form } from 'react-bootstrap';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { getAllUsers } from '../../../../redux/actions'
import ToastHandle from '../../../../constants/toaster/toaster';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const FilterModal = ({ showFilter, closeFilter, setfilterModal }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [personName, setPersonName] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [assignee, setAssignee] = useState();
    // console.log(startDate, 'hiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const getTechnology = store?.getAllTechnologyReducer?.data?.response;
    // disable previous date
    const today = new Date();
    // console.log(today, 'today');
    // end date
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const handleStartDate = (date) => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        if (date < threeMonthsAgo) {
            ToastHandle('error', 'Only past three months data is available.')
            return;
        }

        setStartDate(date);
    };



    const handleEndDate = (date) => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        if (date < threeMonthsAgo) {
            ToastHandle('error', 'Please select a date within the past three months.')
            return;
        }
        setEndDate(date);
    };
    const onSubmit = () => {
        reset();
        alert('Please select a date within the past three months')
    }
    const handleClose = () => {
        setPersonName([]);
        setStartDate('');
        setEndDate('');
        reset();
        closeFilter();
    };



    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch])

    const users = store?.getAllUsers?.data?.response
    return (
        <Modal show={showFilter} onHide={handleClose} size="lg">
            <Row>
                <Col sm={12} className='d-flex justify-content-end pt-2'>
                    <button type="button" className="close border-0 bg-black text-white" onClick={handleClose} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>&nbsp;&nbsp;&nbsp;
                </Col>
                <Col sm={12} className='text-center'>
                    <Modal.Title className='modal_titles'>Export User Data</Modal.Title>
                </Col>
            </Row>
            <Modal.Body className='pt-1'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12}>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="demo-multiple-chip-label">Select Assignee </InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={personName}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} className='h-50' />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {users && users.map((user) => (
                                        <MenuItem
                                            key={user?._id}
                                            value={`${user?.firstName} ${user?.lastName}`}
                                            style={getStyles(user, personName, theme)}
                                        >
                                            {`${user?.firstName} ${user?.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                    <Row className='px-1 py-2'>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                <Form.Label className="w-100">
                                    Start Date<span className="text-danger">*</span>:
                                </Form.Label>

                                <DatePicker
                                    // {...register('pickdate', { required: true })}
                                    selected={startDate}
                                    onChange={(date) => handleStartDate(date)}
                                    placeholderText="mm-dd-yyyy"
                                    maxDate={today}
                                    className="add_width_input"
                                />

                                {/* {errors.pickdate && (<span className='text-danger'>This field is required *</span>)} */}
                            </Form.Group>


                        </Col>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                <Form.Label className="w-100">
                                    End Date<span className="text-danger">*</span>:
                                </Form.Label>
                                <DatePicker
                                    selected={endDate}
                                    disabled={startDate == '' || startDate == undefined}
                                    // onChange={(date) => setEndDate(date)}
                                    onChange={(date) => handleEndDate(date)}
                                    placeholderText="mm-dd-yyyy"
                                    maxDate={today}
                                    className="add_width_input"
                                // {...register('end_date', { required: true })}
                                />
                                {/* {errors.end_date && (<span className='text-danger'>This field is required *</span>)} */}

                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className='d-flex border-0 justify-content-center'>
                <Button type='submit' className='mybutton btn p-1 fw-bold py-1 web_button'>
                    Get Data
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FilterModal;
