import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { addPreSalesData, getPreSalesData, updatePreSalesData } from '../../../../redux/customer/action';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTechnology } from '../../../../redux/technology/action';
import ToastHandle from '../../../../constants/toaster/toaster';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from 'react-datepicker';
// import {ButtonLoading} from '../../../../constants/Loader/loader';
const Edit = ({ modal, editData, closemodal }) => {
    console.log(editData, 'mmmmmmmmmmmmmmmmmmm');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const updatePreSaleStatus = store?.updatePreSaleReducer?.updatePreSale?.status;
    const updatePreSaleMessage = store?.updatePreSaleReducer?.updatePreSale?.message;
    const [addValue, setAddValue] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selected, setSelected] = useState([]);
    const [selectedType, setSelectedType] = useState(['Web', 'Mobile']);
    const [addValueType, setAddValueType] = useState([]);
    console.log(addValueType, 'yyyyyyyyyyyyyyyyyyyyyyyyyyyy');
    // const [selectedTypeValue, setSelectedTypeValue] = useState(['Web', 'Mobile']);
    console.log(startDate, 'hiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const getTechnology = store?.getAllTechnologyReducer?.data?.response;
    // disable previous date
    const today = new Date();
    console.log(today, 'today');
    // end date
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
    };
    // update
    const closeModal = () => {};
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    console.log(watch('status'), 'fffffffffffffffffffffff');
    const onSubmit = (data) => {
        dispatch(
            updatePreSalesData({
                preSalesId: editData?._id,
                clientName: data?.name,
                projectName: data?.project,
                description: data?.description,
                stage: data?.stage,
                type: addValueType,
                status: data?.status,
                technology: addValue,
                startDate: startDate,
                endDate: endDate,
                projectType: data?.project_type,
                projectStatus: data?.Projectstatus,
            })
        );
    };

    useEffect(() => {
        if (updatePreSaleStatus === '200') {
            ToastHandle('success', updatePreSaleMessage);
            closemodal('render');
        } else if (updatePreSaleStatus === 400) {
            ToastHandle('error', updatePreSaleMessage);
        }
    }, [updatePreSaleStatus]);
    // model check two type add and edite;

    useEffect(() => {
        reset({
            name: editData?.clientName,
            project: editData?.projectName,
            description: editData?.description,
            status: editData?.status,
            stage: editData?.stage,
            type: editData?.type,
            project_type: editData?.Project?.projectType,
            Projectstatus: editData?.Project?.projectStatus,
            
        });
        // setSelectedType(editData?.type?.map((ele) => ele));
    }, [modal]);
    const selectedTypeValues = editData?.type?.map((item) => {
        return item;
    });
    const addTypehandle = (selectedList, selectItem) => {
        setAddValueType(selectedList);
    };
    const removeTypehandle = (selectedList, removedItem) => {
        const remove = selectedType.filter((ele, ind) => {
            return ele !== removedItem;
        });
        const arr = [];
        selectedList.forEach((element) => {
            selectedType.filter((ele) => {
                if (ele === element) {
                    arr.push(ele);
                    return setAddValueType(arr);
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
    const selectedValues = editData?.Project?.technology?.map((item) => {
        return item;
    });
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
            <Modal
                // {...props}
                show={modal}
                onHide={closemodal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">update</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="pt-2">
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                        Name<span className="text-danger">*</span>:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Please Enter Name"
                                        {...register('name', { required: true })}
                                    />
                                    {errors?.name?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                        Project<span className="text-danger">*</span>:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Project"
                                        {...register('project', { required: true })}
                                    />
                                    {errors?.project?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        Description<span className="text-danger">*</span>:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Description"
                                        {...register('description', { required: true })}
                                    />
                                    {errors?.description?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        Status<span className="text-danger">*</span>:
                                    </Form.Label>

                                    <Form.Select {...register('status', { required: true })}>
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">CONVERTED</option>
                                        <option value="2">NOT-CONVERTED</option>
                                    </Form.Select>

                                    {errors?.status?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        STAGE<span className="text-danger">*</span>:
                                    </Form.Label>
                                    <Form.Select {...register('stage', { required: true })}>
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">HOT</option>
                                        <option value="2">COLD</option>
                                        <option value="3">MEDIUM</option>
                                    </Form.Select>
                                    {errors?.stage?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>
                                        TYPE<span className="text-danger">*</span>:
                                    </Form.Label>

                                    {/* <Form.Select {...register('type', { required: true })}>
                                        <option value="" hidden selected>
                                            {' '}
                                            --select--
                                        </option>
                                        <option value="1">WEB</option>
                                        <option value="2">MOBILE</option>
                                    </Form.Select>
                                    {errors?.type?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )} */}
                                    <Multiselect
                                        {...register('type', { required: false })}
                                        onRemove={removeTypehandle}
                                        onSelect={addTypehandle}
                                        isObject={false}
                                        options={selectedType}
                                        selectedValues={selectedTypeValues}
                                        showCheckbox
                                        placeholder="Select Type"
                                    />
                                    {errors.type?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {watch('status') == 1 ? (
                            <>
                                {' '}
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Type Of Project <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('project_type', { required: true })}>
                                                <option hidden selected>
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
                                            <Form.Label className="w-100">
                                                Start Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            {/* <Form.Control
                                                type="date"
                                                min={today} // Set the minimum date to today
                                                {...register('startDate', { required: true })}
                                                placeholder="Please start Date "
                                            />
                                            {errors.startDate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )} */}

                                            <DatePicker
                                                selected={startDate}
                                                // onChange={(date) => setStartDate(date)}
                                                onChange={(date) => handleStartDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={today}
                                                className="add_width_input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="w-100">
                                                End Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            {/* <Form.Control
                                                type="date"
                                                disabled={watch('startDate') == '' || watch('startDate') == undefined}
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
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Status<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('Projectstatus', { required: true })}>
                                                <option hidden selected>
                                                    Select Status
                                                </option>
                                                <option value="1">To-Do</option>
                                                <option value="2">Live</option>
                                                <option value="3">Hold</option>
                                                <option value="4">Completed</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            ''
                        )}

                        <Row>
                            <Col lg={6} className="text-end">
                                <Button type="submit web_button" className="web_button">
                                    Update
                                </Button>
                            </Col>
                            <Col lg={6}>
                                <Button className="btn btn-danger " onClick={closemodal}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default Edit;
