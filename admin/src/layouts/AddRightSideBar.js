import react, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, getAllRoles, getAllUsers } from '../redux/actions';
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function RightBar(props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const { showModal, setShowModal, content ,projectId,mileStoneId,sprintId} = props;

    const store = useSelector((state) => state);
    const [description, setDescription] = useState('');
    // const projectId = store?.getProjectId?.data;
    // const milestoneId = store?.getMilestoneId?.data;
    // const sprintid = store?.getSprintId?.data;
    // const sucesshandel =store?.createTaskReducer?.data
    const today = new Date().toISOString().split('T')[0];
    const dispatch = useDispatch();
    const onSubmit = (e) => {
        let body = new FormData();
        body.append("projectId", projectId)
        body.append("milestoneId", mileStoneId)
        body.append("sprintId", sprintId)
        body.append("summary", e.Summary)
        body.append("description",description)
        body.append("assigneeId",e.Assignee)
        body.append("reporterId",e.Report)
        body.append("priority", e.priority)
        body.append("startDate",e.start_date)
        body.append("dueDate",e.last_date)
        body.append("status",1)
        body.append("attachment",e.Attachment[0])
        if (projectId !== '' && mileStoneId !== '' && sprintId !== '') {
            dispatch(createTask(body));
        } else {
            alert('plsease select project');
        }
        setValue("Summary","")
        setValue("Assignee","")
        setValue("Report","")
        setValue("priority","")
        setValue("start_date","")
        setValue("last_date","")
        setValue("Attachment","")
        setDescription("")
        setShowModal(false);
    };
    useEffect(() => {
        dispatch(getAllRoles());
        dispatch(getAllUsers());
    }, []);
    // useEffect(() => {
    //     if (sucesshandel?.data?.status == 200) {
    //         ToastHandle('success', 'Updated Successfully');
    //         closeModal('render');
    //     } else if (sucesshandel?.data?.status == 400) {
    //         ToastHandle('error', sucesshandel?.data?.message);
    //     } else if (sucesshandel?.data?.status == 500) {
    //         ToastHandle('error', sucesshandel?.data?.message);
    //     }
    // }, [sucesshandel]);
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
                            <div class="row"></div>
                            <div class="row"></div>
                            <div className="row">
                                <div class="col-lg-12">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlInput1">
                                            Description <span class="text-danger">*</span>:
                                        </label>

                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{
                                                ckfinder: {
                                                    uploadUrl:
                                                        'https://ckeditor.com/apps/ckfinder/3.5.0/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
                                                },
                                            }}
                                            data=""
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setDescription(data);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div class="">
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
                                            {...register('Assignee')}>
                                            <option value={''}>--Select--</option>
                                            {store?.getAllUsers?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}> {ele?.firstName} {ele?.lastName}</option>
                                            ))}
                                        </select>
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
                                            {...register('Report')}>
                                            <option value={''}>--Select--</option>
                                            {store?.getAllRoles?.data?.response?.map((ele, ind) => (
                                                <option value={ele?._id}> {ele?.role} </option>
                                            ))}
                                        </select>
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
                                            {...register('start_date')}
                                        />
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
                                            disabled={watch("start_date")== ""|| watch("start_date")== undefined }
                                                min={watch("start_date")} 
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('last_date')}
                                        />
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
                                            {...register('priority')}>
                                            <option>-----select----</option>
                                            <option value="1">High</option>
                                            <option value="2">Medium</option>
                                            <option value="3">Low</option>
                                        </select>
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
                                        Attachment<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            type="file"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('Attachment')}
                                        />
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
