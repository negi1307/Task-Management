import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
// import * as yup from 'yup';

import { Row, Col, Card, Button, Alert, CloseButton, FormControl } from 'react-bootstrap';
import { addProject } from '../../../../redux/projects/action';
import ToastHandle from '../../../../constants/toaster/toaster';
import MainLoader from '../../../../constants/Loader/loader';
//import Multiselect from 'multiselect-react-dropdown';
import { getAllTechnology } from '../../../../redux/technology/action';
import { getAllProjects } from '../../../../redux/projects/action';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from 'react-datepicker';
import '../../../../../node_modules/react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
// import "../../../../../node_modules/"
const Create = ({ modal, closeModal }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [selected, setSelected] = useState([]);
    const [selectedenDate, setSelectedenDate] = useState();
    const errorhandel = store?.addProject;
    const loaderhandel = store?.addProject;
    const [addValue, setAddValue] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // console.log(startDate, 'hiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const getTechnology = store?.getAllTechnologyReducer?.data?.response;
    // disable previous date
    const today = new Date();
    // console.log(today, 'today');
    // end date
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
    };

    //
    // const validationSchema = yup.object().shape({
    //     projectName: yup.string().required('Project Name is required'),
    //     clientName: yup.string().required('Client Name is required'),
    //     project_type: yup.string().required('Project Type is required'),
    //     technology: yup.array().min(1, 'At least one technology is required').required('Technology is required'),
    //     startDate: yup.date().required('Start Date is required'),
    //     endDate: yup.date().when('startDate', {
    //         is: (startDate) => startDate,
    //         then: yup.date().min(yup.ref('startDate'), 'End Date should be after Start Date').required('End Date is required'),
    //     }),
    // });
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        let body = {
            projectName: data?.projectName,
            clientName: data?.clientName,
            startDate: startDate,
            endDate: endDate,
            projectType: data?.project_type,
            projectStatus: 'Ongoing',
            technology: addValue,
        };
        dispatch(addProject(body))
    };
    useEffect(() => {
        if (errorhandel?.data?.status == 200) {
            ToastHandle('success', 'Successfully added');
            closeModal('render');
            // console.log(addValue)
        } else if (errorhandel?.data?.status == 400) {
            ToastHandle('error', errorhandel?.data?.message);
        } else if (errorhandel?.data?.status == 500) {
            ToastHandle('error', errorhandel?.data?.message);
        }
    }, [errorhandel?.data?.status]);
    useEffect(() => {
        reset();
        setStartDate('');
        setEndDate('');
        setAddValue('')
        // console.log(addValue)
    }, [modal]);
    const removehandle = (selectedList, removedItem) => {
        const remove = getTechnology.filter((ele, ind) => {
            return ele?.techName == removedItem;
        });
        var index = addValue.indexOf(remove[0]._id);
        if (index !== -1) {
            addValue.splice(index, 1);
            setAddValue(addValue);
            // console.log('remove', addValue);
        } else {
            setAddValue(null);
        }
    };

    const addhandle = (selectedList, selectItem) => {
        const add = getTechnology.filter((ele, ind) => {
            return ele?.techName == selectItem;
        });
        setAddValue([...addValue, add[0]._id]);
        // reset();
    };

    useEffect(() => {
        const getTechnologyname = [];
        dispatch(getAllTechnology({ status: true }));
        for (let i = 0; i < getTechnology?.length; i++) {
            getTechnologyname.push(getTechnology[i]?.techName);
        }
        setSelected(getTechnologyname);
    }, [modal]);

    return (
        <>
            <Modal show={modal} className="add_round" onHide={closeModal} size="lg">
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={12} className="text-end pt-2">
                                <button type="button" className="close border-0 bg-black text-white" onClick={closeModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Col>
                            <Col lg={12} className="text-center">
                                <Modal.Title id="" className="mx-auto modal_titles">
                                    Create Project
                                </Modal.Title>
                            </Col>

                        </Row>
                    </Col>
                </Row>
                <Modal.Body className="py-0">
                    {loaderhandel?.loading ? (
                        <>
                            <MainLoader />
                        </>
                    ) : (
                        <div className="p-3 pt-0">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Project Name <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter Project Name"
                                                {...register('projectName', { required: true })}
                                            />
                                            {errors.projectName?.type === 'required' && (
                                                <span className="text-danger"> This field is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Client Name <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter Client Name"
                                                {...register('clientName', { required: true })}
                                            />
                                            {errors.clientName?.type === 'required' && (
                                                <span className="text-danger"> This field is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Type Of Project <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select
                                                {...register('project_type', { required: true })}
                                                onChange={(e) => e.target.value && setValue('project_type', e.target.value, { shouldValidate: true })}
                                            >
                                                <option hidden value="">Choose a Project Type</option>
                                                <option value="T&M">T&M</option>
                                                <option value="FC">FC</option>
                                                <option value="HR">HR</option>
                                                <option value="DT">DT</option>
                                            </Form.Select>
                                            {errors.project_type && (
                                                <span className="text-danger"> This field is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Select Your Technology <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Multiselect
                                                onRemove={removehandle}
                                                onSelect={addhandle}
                                                isObject={false}
                                                options={selected}
                                                showCheckbox
                                                placeholder="Select Technology"
                                                {...register('technology')}
                                            />

                                        </Form.Group>
                                        {/* {errors.technology && (<span className='text-danger'>This field is required *</span>)} */}
                                    </Col>
                                </Row>

                                <Row>
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
                                                // minDate={today}
                                                required
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
                                                minDate={startDate}
                                                required
                                                className="add_width_input"
                                            // {...register('end_date', { required: true })}
                                            />
                                            {/* {errors.end_date && (<span className='text-danger'>This field is required *</span>)} */}

                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Status<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('status', { required: true })}>
                                                <option hidden selected>
                                                    Ongoing
                                                </option>
                                                <option value="1">Ongoing</option>
                                                <option value="2">yhb</option>
                                                <option value="3">fghjk</option>
                                             
                                            
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>  */}
                                <Row>
                                    <Col className="text-start d-flex align-items-center justify-content-center">
                                        <Button
                                            variant="info"
                                            type="submit"
                                            className="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button ">
                                            Add
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Create;
