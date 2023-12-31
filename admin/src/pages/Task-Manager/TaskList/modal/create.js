import React from 'react';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Button, CloseButton, Card } from 'react-bootstrap';
import { createTask } from '../../../../redux/task/action';
import ToastHandle from '../../../../constants/toaster/toaster';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getSingleSprint, getsingleMileStone } from '../../../../redux/actions';
import moment from 'moment';
import pdfImage from '../../../../../src/assets/images/pdf.png';
const Create = ({ modal, CloseModal }) => {
    const {
        register,
        handleSubmit,
        watch,setValue,
        formState: { errors },
    } = useForm();
    const store = useSelector((state) => state);

    const [description, setDescription] = useState('');
    const [milestoneDisable,setMilestoneDisable]=useState(true)
    const [sprintDisable,setsprintDisable]=useState(true)
    const projectId = store?.getProjectId?.data;
    const milestoneId = store?.getMilestoneId?.data;
    const sprintid = store?.getSprintId?.data;
    const Createhandel = store?.createTaskReducer;
    const [selectedFile, setSelectedFile] = useState('');
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if(file){
            setSelectedFile(file);
            alert('File selected');
        }
     else {
        alert('File Not selected');
        setSelectedFile("");
     }   
       
    };

    const openFileInput = () => {
        document.getElementById('fileInput').click();
    };
    // const sucesshandel =store?.createTaskReducer?.data
    const today = new Date().toISOString().split('T')[0];
    const dispatch = useDispatch();

    const onSubmit = (e) => {
        let body = new FormData();
        body.append('projectId', e.projectname);
        body.append('milestoneId', e.Milestone);
        body.append('sprintId', e.Sprint);
        body.append('summary', e.summary);
        body.append('description', e.description);
        body.append('assigneeId', e.Assignee);
        body.append('reporterId', e.Reporter);
        body.append('priority', e.Priority);
        body.append('startDate', e.startdate);
        body.append('dueDate', e.dueDate);
        body.append('status', 1);
        body.append('attachment', selectedFile);
        
            dispatch(createTask(body));
            setValue('projectname', '');
            setValue('Milestone', '');
            setsprintDisable(true)
            setMilestoneDisable(true)
            setValue('description', '');
            setValue('Sprint', '');
            setValue('summary', '');
            setValue('Assignee', '');
            setValue('Reporter', '');
            setValue('Priority', '');
            setValue('startdate', '');
            setValue('dueDate', '');
            setSelectedFile("")
        // setShowModal(false);
    };

    const handleClose = () => {
        setValue('projectname', '');
        setValue('Milestone', '');
        setsprintDisable(true)
        setMilestoneDisable(true)
        setValue('description', '');
        setValue('Sprint', '');
        setValue('summary', '');
        setValue('Assignee', '');
        setValue('Reporter', '');
        setValue('Priority', '');
        setValue('startdate', '');
        setValue('dueDate', '');
        setSelectedFile("")
        CloseModal();
    };
    useEffect(() => {
        console.log(Createhandel?.data?.status, '////////');
        if (Createhandel?.data?.status == 200) {
            CloseModal('render');
            ToastHandle('success', Createhandel?.data?.message);
        } else if (Createhandel?.data?.status == 400) {
            ToastHandle('error', Createhandel?.data?.message);
        } else if (Createhandel?.data?.status == 500) {
            ToastHandle('error', Createhandel?.data?.message);
        }
    }, [Createhandel]);
    const handelProject=(e)=>{
        dispatch(getsingleMileStone({ id: e.target.value, activeStatus: 1 ,skip:0, mileStoneId:""  }));
        setMilestoneDisable(false)
    }
    const handelmilestone=(e)=>{
        dispatch(getSingleSprint({ activeStatus: 1, id: e.target.value , skip:0}));
        setsprintDisable(false)
    }
    
 
    return (
        <Modal show={modal} onHide={handleClose} size="lg">
            <Row className="m-0 p-0">
                <Col lg={12}>
                    <Row>
                        <Col lg={7} className="text-end">
                            <Modal.Title id="" className="mx-auto">
                                Add Task
                            </Modal.Title>
                        </Col>
                        <Col lg={5} className="text-end pt-2">
                            <CloseButton onClick={handleClose} />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal.Body className="py-0">
                <div className="p-2">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Project<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <Form.Select 
                                                {...register('projectname', { required: true, })} onChange={handelProject}>
                                                <option value={''}>--Select--</option>
                                                {store?.getProject?.data?.response?.map((ele, ind) => (
                                                    <option value={ele?._id} > {ele?.projectName} </option>
                                                ))}
                                            </Form.Select>
                                            {errors.projectname?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Milestone<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <Form.Select {...register('Milestone', { required: true, })} onChange={handelmilestone} disabled={milestoneDisable}>
                                                <option value={''}>--Select--</option>
                                                {store?.getSigleMileStone?.data?.response?.map((ele, ind) => (
                                                    <option value={ele?._id} key={ele?._id}> {ele?.title} </option>
                                                ))}
                                            </Form.Select>
                                            {errors.Milestone?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                    <Row>
                                        <Col lg={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    Sprint <span className="text-danger">*</span>:
                                                </Form.Label>

                                                <Form.Select {...register('Sprint', { required: true ,})}disabled={sprintDisable}>
                                                    <option>--select--</option>
                                                    {store?.getAllSingleSprints?.data?.response?.map((ele, ind) => (
                                                        <option value={ele?._id}> {ele?.sprintName} </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.Sprint?.type === 'required' && (
                                                    <span className="text-danger"> This feild is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Summary <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder=" Enter Task Summary"
                                                {...register('summary', { required: true })}
                                            />{' '}
                                            {errors.summary?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    </Row>
                                </Col>
                        
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Description<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                type="text"
                                                placeholder="Please Enter Description"
                                                {...register('description', { required: true })}
                                            />
                                            {errors.description?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Assignee <span className="text-danger">*</span>:
                                            </Form.Label>

                                            <Form.Select {...register('Assignee', { required: true })}>
                                                <option value={''}>--Select--</option>
                                                {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                    <option value={ele?._id}>
                                                        {' '}
                                                        {ele?.firstName} {ele?.lastName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.Assignee?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Reporter<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('Reporter', { required: true })}>
                                                <option value={''}>--Select--</option>
                                                {store?.getAllRoles?.data?.response?.map((ele, ind) => (
                                                    <option value={ele?._id}> {ele?.role} </option>
                                                ))}
                                            </Form.Select>
                                            {errors.Reporter?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Priority <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Select {...register('Priority', { required: true })}>
                                                <option>-------select----</option>
                                                <option value="1">High</option>
                                                <option value="2">Medium</option>
                                                <option value="3">Low</option>
                                            </Form.Select>
                                            {errors.Priority?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Start Date <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                min={today}
                                                {...register('startdate', { required: true })}
                                            />{' '}
                                            {errors.estimatedate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Due Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                disabled={watch('startdate') == '' || watch('startdate') == undefined}
                                                min={watch('startdate')}
                                                {...register('dueDate', { required: true })}
                                            />{' '}
                                            {errors.dueDate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                {' '}
                                                Status <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="To-Do"
                                                {...register('status', { required: true, disabled: true })}
                                            />
                                            {errors.status?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                   
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Attachment :
                                        </label>
                                        <div onClick={openFileInput}>
                                            <i className="mdi mdi-attachment m-0 p-0 font-20 cp"></i>
                                        </div>
                                        <input
                                            type="file"
                                            accept="application/pdf,image/png,image/jpeg,image/jpg"
                                            id="fileInput"
                                            className="file-input"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                            // {...register('Attachment', { required: true })}
                                        />{' '}
                                        {selectedFile ? (
                                            <img
                                                src={
                                                    selectedFile?.type == 'image/png' ||
                                                    selectedFile?.type == 'image/jpg' ||
                                                    selectedFile?.type === 'image/jpeg'
                                                        ?  URL.createObjectURL( selectedFile)
                                                        : pdfImage
                                                }
                                                className="add_upload_icon_load me-2 h-auto w-25 cp"
                                                alt=""
                                            />
                                        ) : (
                                            ''
                                        )}
                                       
                                    </div>
                                
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
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
            </Modal.Body>
        </Modal>
    );
};

export default Create;
