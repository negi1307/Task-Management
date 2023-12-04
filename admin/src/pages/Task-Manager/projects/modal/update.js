import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import { updateProject } from '../../../../redux/projects/action';
import ToastHandle from '../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import MainLoader from '../../../../constants/Loader/loader';
import Multiselect from 'multiselect-react-dropdown';
import { getAllTechnology } from '../../../../redux/technology/action';
import DatePicker from 'react-datepicker';
import '../../../../../node_modules/react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';

const Update = ({ modal, closeModal, editData }) => {
    console.log(editData);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const sucesshandel = store?.updateProject;
    const loaderhandle = store?.updateProject;
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
    };
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const [selected, setSelected] = useState([]);
    const [finalTechnology, setFinalTechnology] = useState([]);
    const [addValue, setAddValue] = useState([]);
    const getTechnology = store?.getAllTechnologyReducer?.data?.response;
    // disable previous date
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setFinalTechnology(editData?.technology);
        setAddValue(editData?.technology);
        // setStartDate(parseISO(editData?.startDate));
        reset({
            projectName: editData?.projectName,
            clientName: editData?.clientName,
            access: editData?.projectAccess,
            key: editData?.key,
            project_type: editData?.projectType,
            technology: editData?.technology,
            projectstatus: editData?.projectStatus,
        });

    
        if (editData?.startDate || editData?.endDate) {
            const parsedDate = parseISO(editData?.startDate) 
            const endate = parseISO(editData?.endDate)
            if (parsedDate || endate) {
                setStartDate(parsedDate);
                setEndDate(endate)
            } else {
                console.error('Invalid date format:', editData.startDate);
            }
        }
        // setEndDate(editData?.endDate);
    }, [modal]);
    const removehandle = (selectedList, removedItem) => {
        console.log(selectedList);
        const remove = getTechnology.filter((ele, ind) => {
            return ele?.techName !== removedItem;
        });
        const arr = [];
        selectedList.forEach((element) => {
            getTechnology.filter((ele) => {
                if (ele?.techName === element) {
                    arr.push(ele);
                    return setAddValue(arr);
                }
            });
        });
    };
    const addhandle = (selectedList, selectItem) => {
        const add = getTechnology.filter((ele, ind) => {
            return ele?.techName == selectItem;
        });
        console.log(add[0], 'addddd');
        setAddValue([...addValue, add[0]]);
        console.log(addValue, 'addvalue info');
    };

    const onSubmit = (data) => {
        let body = {
            projectId: editData?._id,
            projectName: data?.projectName,
            startDate: startDate,
            endDate: endDate,
            clientName: data?.clientName,
            projectType: data?.project_type,
            technology: addValue,
            projectStatus: data?.projectstatus,
        };
        console.log('fsadsadsadsa', addValue);
        dispatch(updateProject(body));
    };
    const selectedValues = editData?.technology?.map((item) => {
        return item.techName;
    });
    console.log(selected, 'aadadasa');
    useEffect(() => {
        console.log('llllllllll');
        if (sucesshandel?.data?.status == 200) {
            ToastHandle('success', 'Updated Successfully');
            closeModal('render');
        } else if (sucesshandel?.data?.status == 400) {
            ToastHandle('error', sucesshandel?.data?.message);
        } else if (sucesshandel?.data?.status == 500) {
            ToastHandle('error', sucesshandel?.data?.message);
        }
    }, [sucesshandel]);

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
                            <Col lg={7} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Update Project Details
                                </Modal.Title>
                            </Col>
                            <Col lg={5} className="text-end pt-2">
                                <CloseButton onClick={closeModal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {loaderhandle?.loading ? (
                    <>
                        <MainLoader />
                    </>
                ) : (
                    <Modal.Body className="py-0">
                        <div className="p-3">
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
                                                <span className="text-danger"> This feild is required *</span>
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
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Start Date<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => handleStartDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={today}
                                                className="add_width_input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                End Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            {/* <Form.Control
                                                type="date"
                                                min={watch('startDate')}
                                                {...register('endDate', { required: true })}
                                                placeholder="Please end Date"
                                            />
                                            {errors.endDate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )} */}
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
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Type Of Project <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('project_type', { required: true })}>
                                                <option value="" hidden selected>
                                                    Choose an Project Type{' '}
                                                </option>
                                                <option value="T&M">T&M</option>
                                                <option value="FC">FC</option>
                                                <option value=" HR">HR</option>
                                                <option value="DT">DT</option>
                                            </Form.Select>
                                            {errors.project_type?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Select Your Technology <span className="text-danger">*</span>:
                                            </Form.Label>
                                            {/* <Form.Select {...register('technology', { required: true })}>
                                                <option>Choose Technology</option>
                                                <option Value="Web">Web</option>
                                                <option Value="Mobile">Mobile</option>
                                            </Form.Select> */}
                                            <Multiselect
                                                {...register('technology', { required: false })}
                                                onRemove={removehandle}
                                                onSelect={addhandle}
                                                isObject={false}
                                                options={selected}
                                                selectedValues={selectedValues}
                                                placeholder="Select Technology"
                                            />
                                            {errors.technology?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Status<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('projectstatus', { required: true })}>
                                                <option hidden selected>
                                                    Choose an Project Status
                                                </option>
                                                <option value="1">To-Do</option>
                                                <option value="2">Live</option>
                                                <option value="3">Hold</option>
                                                <option value="4">Completed</option>
                                            </Form.Select>
                                            {errors.projectstatus?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="text-start d-flex align-items-center justify-content-center">
                                        <Button
                                            variant="info"
                                            type="submit"
                                            className="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button ">
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
};

export default Update;
