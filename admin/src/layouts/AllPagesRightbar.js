import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, getAllRoles, getAllTask, getAssignUserAction, getAllUsers, getSingleSprint, getAllCategory } from '../redux/actions';
import { getAllProjects } from '../redux/projects/action';
import { getsingleMileStone } from '../redux/milestone/action'
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
import pdfImage from '../../src/assets/images/pdf.png';
import DatePicker from 'react-datepicker';
import '../../node_modules/react-datepicker/dist/react-datepicker.css';
import { getReporterAction } from '../redux/actions';
import ToastHandle from '../constants/toaster/toaster';
import Accordion from 'react-bootstrap/Accordion';


export default function Pagesaddtask(props) {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filePreview, setFilePreview] = useState(null);
    const [projectSelected, setprojectSelected] = useState(null);
    const [milestoneSelected, setmilestoneSelected] = useState(null);
    const [milestoneType, setmilestoneType] = useState(null);
    const [sprintSelected, setsprintSelected] = useState(null);
    const [milestoneData, setmilestoneData] = useState()
    const [selectedProject, setSelectedProject] = useState(null);
    const dispatch = useDispatch();
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const today = new Date();
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);

    };
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const { showModal, setShowModal, columns, onFormSubmit } = props;
    const [selectedFile, setSelectedFile] = useState('');
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            alert('File selected');
        } else {
            alert('File Not selected');
            setSelectedFile('');
        }
    };

    const allDetails = columns?.[1]?.items[0];

    const openFileInput = () => {
        document.getElementById('fileInput').click();
    };
    const store = useSelector((state) => state);
    const category = store?.getAllCategory?.data?.response;
    const onSubmit = (e) => {
        let body = new FormData();
        body.append('projectId', projectSelected);
        body.append('milestoneId', milestoneSelected);
        body.append('sprintId', sprintSelected);
        body.append('summary', e.Summary);
        body.append('label', e.label);
        body.append('description', e.description);
        body.append('assigneeId', e.Assignee);
        body.append('reporterId', e.Reporter);
        body.append('priority', e.priority);
        body.append('startDate', startDate);
        body.append('dueDate', endDate);
        body.append('status', 1);
        body.append('expectedHours', e.expectedHours);
        // body.append('attachment', selectedFile ? selectedFile : '');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput.files.length > 0) {
            body.append('attachment', fileInput.files[0]);
        }
        if (projectSelected !== '' && milestoneSelected !== '' && sprintSelected !== '') {
            dispatch(createTask(body));
            ToastHandle('success', 'Task created successfully');
            // onFormSubmit();
            handelClose();
        } else {
            alert('Please Select Project');
        }
        setValue('Summary', '');
        setValue('Assignee', '');
        setValue('Reporter', '');
        setValue('priority', '');
        setValue('start_date', '');
        setValue('label', '');
        setValue('last_date', '');
        setValue('description', '');
        setShowModal(false);
        setSelectedFile('');
        setStartDate("");
        setEndDate("")
    };
    const handelClose = () => {
        reset();
        // setValue('Summary', '');
        // setValue('Assignee', '');
        // setValue('Reporter', '');
        // setValue('priority', '');
        // setValue('start_date', '');
        // setValue('last_date', '');
        // setValue('description', '');
        setShowModal(false);
        setSelectedFile('');
        setStartDate("");
        setEndDate("")
    };
    useEffect(() => {
        // reset({ projectname: projectId, Milestone: mileStoneId, Sprint: sprintId });
        dispatch(getAllRoles());
        dispatch(getAllUsers());
        dispatch(getAllCategory({status:true}));
        dispatch(getAllProjects({ status: 1, skip: 1, projectStatus: 'Ongoing' }));
        dispatch(getReporterAction())
        // if (projectSelected !== null) {
        //     dispatch(getsingleMileStone({ id: projectSelected, activeStatus: false, skip: 1 }));
        // }
        if (milestoneSelected !== null) {
            dispatch(getSingleSprint({ activeStatus: true, id: milestoneSelected, skip: 1 }));
        }
    }, [showModal, projectSelected, milestoneSelected, dispatch]);

    useEffect(() => {
        if (milestoneType !== null && milestoneType === 'active') {
            dispatch(getsingleMileStone({ id: projectSelected, activeStatus: true, skip: 1 }));
        } else if (milestoneType === 'inactive') {
            dispatch(getsingleMileStone({ id: projectSelected, activeStatus: false, skip: 1 }));
        }
    }, [milestoneType, projectSelected, dispatch]);


    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setprojectSelected(projectId);
    };
    const handleMilestoneChange = (e) => {
        const milestoneId = e.target.value;
        setmilestoneSelected(milestoneId);
    }
    const handleMilestoneType = (e) => {
        const milestoneTypeselected = e.target.value;
        setmilestoneType(milestoneTypeselected);
    }
    console.log({ milestoneType })
    const handleSprintChange = (e) => {
        const sprintId = e.target.value;
        setsprintSelected(sprintId);
    }
    // console.log({ milestoneSelected })

    const reporter = store?.getReporterReducer?.data?.reporterList
    const projectName = store?.getProject?.data?.response;
    // useEffect(() => {
    //     console.log("Milestone Data:", store?.getsingleMileStone?.data?.response);
    // }, [store?.getsingleMileStone?.data?.response]);
    // console.log({ projectName })
    return (
        <div className={props.showModal ? 'modal d-block blur-background' : 'modal d-none'} tabIndex="-1" role="dialog"  >
            <div className="modal-dialog blur-modal-background modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal_titles">Add Task</h3>
                        <button type="button" className="close" onClick={handelClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className="" onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                {' '}
                                <Col lg={12}>
                                    <Row>
                                        <Col lg={12}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    {' '}
                                                    Project<span className="text-danger">*</span>:
                                                </Form.Label>
                                                <Form.Select
                                                    {...register('projectname', { required: true })}
                                                    onChange={(e) => setprojectSelected(e.target.value)}
                                                    value={projectSelected || ''}
                                                >
                                                    <option value=''>Select Project</option>
                                                    {store?.getProject?.data?.response?.map(project => (
                                                        <option key={project?._id} value={project?._id}>{project?.projectName}</option>
                                                    ))}
                                                </Form.Select>
                                                {errors.projectname?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        {/* /////////////////Milestones?/////////////////////// */}
                                        <Col sm={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    Milestone Type<span className="text-danger">*</span>:
                                                </Form.Label>
                                                <Form.Select
                                                    {...register('MilestoneType', { disabled: !projectSelected })}
                                                    onChange={(e) => handleMilestoneType(e)} // Pass the event object directly
                                                    value={milestoneType || ''}
                                                >

                                                    <option value=''>Select Milestone Type</option>
                                                    <option value='active'>Active Milestones</option>
                                                    <option value='inactive'>Inactive Milestones</option>
                                                </Form.Select>

                                                {errors.Milestone?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        {/* <Col lg={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    {' '}
                                                    Milestone<span className="text-danger">*</span>:
                                                </Form.Label>
                                                <Form.Select
                                                    {...register('Milestone', { required: true, disabled: !projectSelected })}
                                                    onChange={(e) => handleMilestoneChange(e)}
                                                    value={milestoneSelected || ''}
                                                >
                                                    <option value=''>Select Milestone</option>
                                                    {store?.getsingleMileStone?.data?.response?.map(milestone => {
                                                        // Check if the milestone matches the selected type
                                                        if (milestone.activeStatus === true) {
                                                            return (
                                                                <option key={milestone._id} value={milestone._id}>{milestone.title}</option>
                                                            );
                                                        } else {
                                                            // Handle inactive milestones if needed
                                                            return null; // Or any logic you need
                                                        }
                                                    })}
                                                </Form.Select>
                                                {errors.Milestone?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col> */}
                                        <Col lg={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    {' '}
                                                    Milestone<span className="text-danger">*</span>:
                                                </Form.Label>
                                                <Form.Select
                                                    {...register('Milestone', { required: true, disabled: !projectSelected })}
                                                    onChange={(e) => setmilestoneSelected(e.target.value)}
                                                    value={milestoneSelected || ''}
                                                >
                                                    <option value=''>Select Milestone</option>
                                                    {store?.getSigleMileStone?.data?.response?.map(milestone => (
                                                        <option key={milestone?._id} value={milestone?._id}>{milestone?.title}</option>
                                                    ))}
                                                </Form.Select>
                                                {errors.Milestone?.type === 'required' && (
                                                    <span className="text-danger"> This field is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </div>

                            <div className="row">
                                <Col lg={6}>
                                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                        <Form.Label>
                                            Sprint <span className="text-danger">*</span>:
                                        </Form.Label>
                                        <Form.Select
                                            {...register('Sprint', { required: true, disabled: !milestoneSelected })}
                                            onChange={(e) => setsprintSelected(e.target.value)}
                                            value={sprintSelected || ''}>
                                            <option value="">Select Sprint</option>
                                            {store?.getAllSingleSprints?.data?.response?.map(sprint => (
                                                <option value={sprint?._id}>{sprint?.sprintName}</option>
                                            )
                                            )}
                                        </Form.Select>
                                        {errors.Sprint?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </Form.Group>
                                </Col>
                                <div className="mb-2 col-6">
                                    <label className="form-label" for="exampleForm.ControlTextarea1">
                                        Summary
                                        <span className="text-danger">*</span>:
                                    </label>
                                    <input
                                        placeholder="Please Enter Summary"
                                        type="text"
                                        id="exampleForm.ControlTextarea1"
                                        className="form-control"
                                        {...register('Summary', { required: true })}
                                    />
                                    {errors.Summary?.type === 'required' && (
                                        <span className="text-danger"> This field is required *</span>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-2">
                                        <label className="form-label" for="exampleForm.ControlInput1">
                                            Description:
                                        </label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Please Enter Description"
                                            rows={3}
                                            type="text"
                                            {...register('description')}
                                        />
                                        {errors.description?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <div className="">
                                    <div className="mb-2">
                                        <label className="form-label" for="exampleForm.ControlTextarea1">
                                            Assignee
                                            <span className="text-danger">*</span>:
                                        </label>

                                        <select
                                            name="Assignee"
                                            className="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('Assignee', { required: true })}>
                                            <option value={''} hidden selected>
                                                Select
                                            </option>
                                            {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}>
                                                    {' '}
                                                    {ele?.firstName} {ele?.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.Assignee?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2">
                                        <label className="form-label" for="exampleForm.ControlTextarea1">
                                            label
                                            <span className="text-danger">*</span>:
                                        </label>

                                        <select
                                            name="label"
                                            className="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('label', { required: true })}>
                                            <option value={''} hidden selected>
                                                Select

                                            </option>
                                            {category?.map((ele, ind) => (
                                                <option value={ele?._id}>
                                                    {' '}
                                                    {ele?.name} 
                                                </option>
                                            ))}
                                        </select>
                                        {errors.label?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div className="">
                                    <div className="mb-2">
                                        <label className="form-label" for="exampleForm.ControlTextarea1">
                                            Reporter
                                            <span className="text-danger">*</span>:
                                        </label>

                                        <select
                                            name="Reporetr"
                                            className="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('Reporter', { required: true })}>
                                            <option value={''} hidden selected>
                                                Select
                                            </option>
                                            {reporter?.map((ele, ind) => (
                                                <option value={ele?._id}>
                                                    {' '}
                                                    {ele?.firstName} {ele?.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.Reporter?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-2">
                                        <label className="form-label" for="exampleForm.ControlInput1">
                                            Expected Hours <span className="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please Expected Hours "
                                            type="number"
                                            id="exampleForm.ControlTextarea1"
                                            className="form-control"
                                            {...register('expectedHours', { required: true })}
                                        />
                                        {errors.expectedHours?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-6">
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
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
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
                                            // minDate={startDate}
                                            className="add_width_input"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-1">
                                        <label className="form-label" for="exampleForm.ControlInput1">
                                            {' '}
                                            Priority <span className="text-danger">*</span>:
                                        </label>
                                        <select
                                            name="Priority"
                                            className="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('priority', { required: true })}>
                                            <option hidden selected>
                                                Select Priority
                                            </option>
                                            <option value="Critical">
                                                &#128308;
                                                Critical
                                            </option>
                                            <option value="High">
                                                &#128992;
                                                High</option>
                                            <option value="Medium">
                                                &#128993;
                                                Medium</option>
                                            <option value="Low">
                                                &#128994;
                                                Low</option>
                                        </select>

                                        {errors?.priority?.type === 'required' && (
                                            <span className="text-danger"> This field is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                        <Form.Label className='mb-0'>Attachment</Form.Label>
                                        <Form.Control
                                            style={{ border: '1px solid #a6b3c3' }}
                                            type='file'
                                            onChange={handleFileChange}
                                        />
                                    </Form.Group>
                                    {filePreview && (
                                        <div>
                                            <p>Preview:</p>
                                            <img src={filePreview} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <div className="row">
                                  <div className="col-lg-6">
                                      <div className="mb-2">
                                          <label className="form-label" for="exampleForm.ControlTextarea1">
                                              Status<span className="text-danger">*</span>:
                                          </label>
                                          <input
                                              disabled="Live"
                                              name="status"
                                              placeholder="To-Do"
                                              type="text"
                                              id="exampleForm.ControlTextarea1"
                                              className="form-control"
                                          />
                                      </div>
                                  </div>
                                  <div className="col-lg-6">
                                      <div className="mb-2">
                                          <label className="form-label" for="exampleForm.ControlTextarea1">
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
                                                         ? URL.createObjectURL(selectedFile)
                                                         : pdfImage
                                                 }
                                                 className="add_upload_icon_load me-2 h-auto w-75 cp"
                                                 alt=""
                                             />
                                         ) : (
                                             ''
                                         )}
                                     </div>
                                 </div>
                                </div> */}
                            <div className="row"></div>
                            <div className="row">
                                <div className="text-start d-flex align-items-end justify-content-center col">
                                    <button
                                        type="submit"
                                        className="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button  btn btn-info">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >

        </div >
    );
}
