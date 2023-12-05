import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, dispatch } from 'react-redux';
import { createTask } from '../redux/actions';
import { useParams } from 'react-router-dom';
// import {getassignee} from '../../src/redux/assigneeid/actions'
import { getAllUsers, getAllRoles } from './../redux/user/action';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useState } from 'react';
import { getAllProjects } from '../../src/redux/projects/action';
import DatePicker from 'react-datepicker';

export default function RightBar(props) {
    const { showModal, setShowModal, content, callAlltaskData } = props;
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndtDate] = useState('');
    const getAllUserData = store?.getAllUsers?.data?.response;
    const getAllRole = store?.getAllRoles?.data?.response;
    // console.log("getAllRoleeeee",getAllRole)
    // console.log("getAllUserTask",getAllUserData)

    const id = store?.Auth?.user?.userId;
    console.log("userID",id)
    //     const projectId=store?.getProjectId?.data
    // const milstoneId=store?.getMilestoneId?.data
    // const SprintId=store?.getSprintId?.data

    const { projectId, milestoneId, spriteId } = useParams();

    useEffect(() => {
        let body = {
            projectId: projectId,
            milestoneId: milestoneId,
            sprintId: spriteId,
            flag: 4,
            skip: 1,
        };
        dispatch(getAllProjects(body));
    }, []);

    const [fileData, setFile] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        // dispatch(getassignee(id))
        dispatch(getAllUsers());
        dispatch(getAllRoles());
    }, []);

    const [fileName, setFileName] = useState('');
    const [filePreviewData, setfilePreviewData] = useState(null);
    const onSubmit = (e) => {
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('milestoneId', milestoneId);
        formData.append('sprintId', spriteId);
        formData.append('summary', e.Summary);
        //formData.append('expectedHours', e.expectedHours)
        formData.append('description', description);
        formData.append('assigneeId', id);
        formData.append('reporterId', e.Report);
        formData.append('priority', e.priority);
        formData.append('startDate', startDate);
        formData.append('dueDate', endDate);        
        formData.append('attachment', filePreviewData);

        if (projectId !== '' && milestoneId !== '' && spriteId !== '') {
            dispatch(createTask(formData));
            setTimeout(() => {
                callAlltaskData();
            }, 600);
        } else {
            alert('plsease select project');
        }

        setValue('Summary', '');
        setValue('Description', '');
        setValue('expectedHours', '');
        setValue('Report', '');
        setValue('priority', '');
        setValue('start_date', '');
        setValue('last_date', '');
        setValue('attachment', '');
        setShowModal(false);
    };

    // useEffect(() => {
    // call click outside
    // }, []);

    const onFileChange = (e) => {
        setFileName(e.target.files[0].name);
        setfilePreviewData(e.target.files[0]);
    };
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
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title" id="myModalLabel"></h4>
                </div>

                <div className="modal-body">
                    <p>{content}</p>
                    <div className="model-content-detail">
                        <form class="" onSubmit={handleSubmit(onSubmit)}>
                            <div class="row">
                                <div class="">
                                    <div class="mb-2">
                                        <input
                                            placeholder="project id"
                                            type="hidden"
                                            id="exampleForm.ControlInput1"
                                            class="form-control"
                                            {...register('projectid')}
                                        />
                                    </div>
                                </div>
                                <div class="">
                                    <div class="mb-2">
                                        <input
                                            placeholder="milestone id"
                                            type="hidden"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('milestoneid')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="">
                                    <div class="mb-2">
                                        <input
                                            placeholder="sprint id"
                                            name="clientName"
                                            type="hidden"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('sprintid')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2 textarea_section">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Project Name <span class="text-danger">*</span>:
                                        </label>
                                        <br />
                                        <input
                                            disabled
                                            value={store?.getProject?.data?.response?.projectId?.projectName}
                                            placeholder="Please Enter Summary"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2 textarea_section">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Milestone Name <span class="text-danger">*</span>:
                                        </label>
                                        <br />
                                        <input
                                            disabled
                                            value={store?.getProject?.data?.response?.milestoneId?.title}
                                            placeholder="Please Enter Summary"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2 textarea_section">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Sprint Name <span class="text-danger">*</span>:
                                        </label>
                                        <br />
                                        <input
                                            disabled
                                            value={store?.getProject?.data?.response?.sprintName}
                                            placeholder="Please Enter Summary"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="mb-2 textarea_section">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Description <span class="text-danger">*</span>:
                                        </label>
                                        <br />

                                        <textarea
                                            col="5"
                                            row="6"
                                            class="form-control"
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                            }}></textarea>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <input
                                            placeholder="Please Enter Summary"
                                            type="hidden"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('expectedHours')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Summary
                                            <span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please Enter Summary"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('Summary')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Report <span class="text-danger">*</span>:
                                        </label>
                                        <select
                                            name="Reporter"
                                            defaultValue="Admin"
                                            class="form-select"
                                            id="exampleForm.ControlInput1"
                                            {...register('Report')}>
                                            <option value="">--Select--</option>
                                            {getAllRole?.map((items, index) => (
                                                <option value={items._id}> {items.role} </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2 ">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Start Date<span class="text-danger">*</span>:
                                        </label>
                                        {/* <input
                                            placeholder="Please start Date "
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('start_date')}
                                        /> */}
                                        {/* <DatePicker
                                                selected={startDate}
                                                // onChange={(date) => setStartDate(date)}
                                                onChange={(date)=>handleStartDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={today}
                                                className='add_width_input'
                                            /> */}

                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            minDate={new Date()}
                                            placeholderText="mm/dd/yyyy"
                                            dateFormat={'MM/dd/yyyy'}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            End Date<span class="text-danger">*</span>:
                                        </label>
                                        {/* <input
                                            placeholder="Please end Date"
                                            type="date"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('last_date')}
                                        /> */}
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndtDate(date)}
                                            minDate={new Date()}
                                            disabled={startDate ? false : true}
                                            placeholderText="mm/dd/yyyy"
                                            dateFormat={'MM/dd/yyyy'}
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div class="">
                                    <div class="mb-1">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            {' '}
                                            Priority <span class="text-danger">*</span>:
                                        </label>
                                        <select
                                            name="Priority"
                                            class="form-select"
                                            id="exampleForm.ControlInput2"
                                            {...register('priority')}>
                                            <option value="1">High</option>
                                            <option value="2">Medium</option>
                                            <option value="3">Low</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea3">
                                            Status<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            disabled="Todo"
                                            name="status"
                                            placeholder="Todo"
                                            type="text"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div class="mb-2">
                                    <label class="form-label" for="exampleForm.ControlTextarea1">
                                        Attachment<span class="text-danger">*</span>:
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('file').click()}
                                        className="attachment">
                                        <i className="mdi mdi-attachment m-0 p-0 font-20 cp"></i>
                                    </button>
                                    <input
                                        hidden="hidden"
                                        placeholder="Please start Date "
                                        type="file"
                                        id="file"
                                        class="form-control"
                                        {...register('attachment')}
                                        onChange={onFileChange}
                                    />
                                    {filePreviewData && <img src={URL.createObjectURL(filePreviewData)} />}
                                </div>
                            </div>
                            <div class=""></div>
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
