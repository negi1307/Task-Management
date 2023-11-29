import react, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, getAllRoles, getAllUsers, getSingleSprint } from '../redux/actions';
import Form from 'react-bootstrap/Form';
import { Row, Col, Button, CloseButton, Card } from 'react-bootstrap';
import pdfImage from '../../src/assets/images/pdf.png';
export default function RightBar(props) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const { showModal, setShowModal, content, projectId, mileStoneId, sprintId } = props;
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
    const store = useSelector((state) => state);
    // const projectId = store?.getProjectId?.data;
    // const milestoneId = store?.getMilestoneId?.data;
    // const sprintid = store?.getSprintId?.data;
    // const sucesshandel =store?.createTaskReducer?.data
    const today = new Date().toISOString().split('T')[0];
    const dispatch = useDispatch();
    const onSubmit = (e) => {
        console.log(errors);
        let body = new FormData();
        body.append('projectId', projectId);
        body.append('milestoneId', mileStoneId);
        body.append('sprintId', sprintId);
        body.append('summary', e.Summary);
        body.append('description', e.description);
        body.append('assigneeId', e.Assignee);
        body.append('reporterId', e.Report);
        body.append('priority', e.priority);
        body.append('startDate', e.start_date);
        body.append('dueDate', e.last_date);
        body.append('status', 1);
        body.append('attachment', selectedFile ? selectedFile :"");
        if (projectId !== '' && mileStoneId !== '' && sprintId !== '') {
            dispatch(createTask(body));
        } else {
            alert('plsease select project');
        }
        setValue('Summary', '');
        setValue('Assignee', '');
        setValue('Report', '');
        setValue('priority', '');
        setValue('start_date', '');
        setValue('last_date', '');
        setValue('description','')
        setShowModal(false);
        setSelectedFile("")
    };
    const handelClose=()=>{
        setValue('Summary', '');
        setValue('Assignee', '');
        setValue('Report', '');
        setValue('priority', '');
        setValue('start_date', '');
        setValue('last_date', '');
        setValue('description','')
        setShowModal(false);
        setSelectedFile("")
    }
    useEffect(() => {
        reset({ projectname: projectId, Milestone: mileStoneId, Sprint: sprintId });
    }, [showModal]);

    useEffect(() => {
        dispatch(getAllRoles());
        dispatch(getAllUsers());
    }, []);
    return (
        <div className={showModal ? 'rightBar show' : 'rightBar'} role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Add Task</h3>
                    <button
                        type="button"
                        className="close "
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={handelClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title" id="myModalLabel"></h4>
                </div>

                <div className="modal-body">
                    <p>{content}</p>
                    <div className="model-content-detail">
                        <form class="" onSubmit={handleSubmit(onSubmit)}>
                            <div class="row">
                                {' '}
                                <Col lg={12}>
                                    <Row>
                                        <Col lg={6}>
                                            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                                <Form.Label>
                                                    {' '}
                                                    Project<span className="text-danger">*</span>:
                                                </Form.Label>

                                                <Form.Select
                                                    {...register('projectname', { required: true, disabled: true })}>
                                                    {/* <option value={''}>--Select--</option> */}
                                                    {store?.getProject?.data?.response?.map((ele, ind) => (
                                                        <option value={ele?._id}> {ele?.projectName} </option>
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

                                                <Form.Select
                                                    {...register('Milestone', { required: true, disabled: true })}>
                                                    {/* <option value={''}>--Select--</option> */}
                                                    {store?.getSigleMileStone?.data?.response?.map((ele, ind) => (
                                                        <option value={ele?._id}> {ele?.title} </option>
                                                    ))}
                                                </Form.Select>
                                                {errors.Milestone?.type === 'required' && (
                                                    <span className="text-danger"> This feild is required *</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </div>

                            <div class="row">
                                <Col lg={6}>
                                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                        <Form.Label>
                                            Sprint <span className="text-danger">*</span>:
                                        </Form.Label>

                                        <Form.Select {...register('Sprint', { required: true, disabled: true })}>
                                            {store?.getAllSingleSprints?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}> {ele?.sprintName} </option>
                                            ))}
                                        </Form.Select>
                                        {errors.Sprint?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </Form.Group>
                                </Col>
                                <div class="mb-2 col-6">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        Summary
                                        <span class="text-danger">*</span>:
                                    </label>
                                    <input
                                        placeholder="Please Enter Summary"
                                        type="text"
                                        id="exampleForm.ControlTextarea1"
                                        class="form-control"
                                        {...register('Summary', { required: true })}
                                    />
                                    {errors.Summary?.type === 'required' && (
                                        <span className="text-danger"> This feild is required *</span>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div class="col-lg-12">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Description <span class="text-danger">*</span>:
                                        </label>

                                        <Form.Control
                                            as="textarea"
                                            placeholder="Please Enter Description"
                                            rows={3}
                                            type="text"
                                            {...register('description', { required: true })}
                                        />
                                        {errors.description?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div class="">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Assignee
                                            <span class="text-danger">*</span>:
                                        </label>

                                        <select
                                            name="Assignee"
                                            class="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('Assignee', { required: true })}>
                                            <option value={''}>--Select--</option>
                                            {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}>
                                                    {' '}
                                                    {ele?.firstName} {ele?.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.Assignee?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Report <span class="text-danger">*</span>:
                                        </label>
                                        <select
                                            name="Reporter"
                                            defaultValue="Admin"
                                            class="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('Report', { required: true })}>
                                            <option value={''}>--Select--</option>
                                            {store?.getAllRoles?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}> {ele?.role} </option>
                                            ))}
                                        </select>
                                        {errors.Report?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Start Date<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please start Date "
                                            type="date"
                                            min={today}
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('start_date', { required: true })}
                                        />
                                        {errors.start_date?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            End Date<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please end Date"
                                            type="date"
                                            disabled={watch('start_date') == '' || watch('start_date') == undefined}
                                            min={watch('start_date')}
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('last_date', { required: true })}
                                        />
                                        {errors.last_date?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-1">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            {' '}
                                            Priority <span class="text-danger">*</span>:
                                        </label>
                                        <select
                                            name="Priority"
                                            class="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('priority', { required: true })}>
                                            <option>-----select----</option>
                                            <option value="1">High</option>
                                            <option value="2">Medium</option>
                                            <option value="3">Low</option>
                                        </select>

                                        {errors?.priority?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Status<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            disabled="Live"
                                            name="status"
                                            placeholder="To-Do"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
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
                                                className="add_upload_icon_load me-2 h-auto w-75 cp"
                                                alt=""
                                            />
                                        ) : (
                                            ''
                                        )}
                                       
                                    </div>
                                </div>
                            </div>

                            <div class="row"></div>
                            <div class="row">
                                <div class="text-start d-flex align-items-end justify-content-end col">
                                    <button
                                        type="submit"
                                        class="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button  btn btn-info">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
