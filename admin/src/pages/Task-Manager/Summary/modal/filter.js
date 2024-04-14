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
import { getUserRecord } from '../../../../redux/timeTracker/action';
import Multiselect from 'multiselect-react-dropdown';

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
    // const [personName, setPersonName] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // const [assignee, setAssignee] = useState();
    const [selectedValues, setSelectedValues] = useState([]);
    const [userId, setUserId] = useState(null); // State to store the selected userId

    const users = store?.getAllUsers?.data?.response
    const getTechnology = store?.getAllTechnologyReducer?.data?.response;
    const today = new Date();
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
        console.log({ startDate });
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
    const onSubmit = (e) => {
        let body = new FormData();
        body.append('startDate', startDate);
        body.append('dueDate', endDate);
        body.append('userId', userId);
        if (startDate !== '' && endDate !== '') {
            dispatch(getUserRecord(body));
            ToastHandle('success', 'Task created successfully');
        }
    }


    const onSelect = (selectedList, selectedItem) => {
        setUserId(selectedItem.id); // Set the selected userId
    };

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch])
    // console.log(store?.getUserRecordReducer, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

    const options = users?.map(user => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`
    }));

    const handleClose = () => {
        setfilterModal(false);
        closeFilter();
        reset();
    };
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
                            <Multiselect
                                options={options}
                                selectedValues={selectedValues}
                                onSelect={onSelect}
                                // onRemove={onRemove}
                                displayValue="name"
                            />
                        </Col>
                    </Row>
                    <Row className='px-1 py-2'>
                        <Col lg={6}>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                <Form.Label className="w-100">
                                    Start Date<span className="text-danger">*</span>:
                                </Form.Label>

                                <DatePicker
                                    selected={startDate}
                                    // onChange={(date) => setStartDate(date)}
                                    onChange={(date) => handleStartDate(date)}
                                    placeholderText="mm-dd-yyyy"
                                    // minDate={today}
                                    className="add_width_input"
                                />
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
                                    minDate={startDate}
                                    className="add_width_input"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Button type='submit' className='mybutton btn p-1 fw-bold py-1 web_button'>
                            Get Data
                        </Button>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
export default FilterModal;
