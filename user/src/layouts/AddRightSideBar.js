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

export default function RightBar(props) {
    
    const { showModal, setShowModal, content,callAlltaskData } = props;
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [description, setDescription] = useState('');
    const getAllUserData = store?.getAllUsers?.data?.response
    const getAllRole = store?.getAllRoles?.data?.response
    // console.log("getAllRoleeeee",getAllRole)
    // console.log("getAllUserTask",getAllUserData)


    const id = store?.Auth?.user?.userId
    
const projectId=store?.getProjectId?.data
const milstoneId=store?.getMilestoneId?.data
const SprintId=store?.getSprintId?.data

    const[fileData,setFile]=useState(null)
   
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    useEffect(() => {
        // dispatch(getassignee(id))
        dispatch(getAllUsers())
        dispatch(getAllRoles())

    }, [])


    const onSubmit = (e) => {
        const formData=new FormData()
        formData.append('projectId',projectId)
        formData.append('milestoneId',milstoneId)
        formData.append('sprintId',SprintId)
        formData.append('summary',e.Summary)
        formData.append('description',description)
        formData.append('assigneeId',e.Assignee)
        formData.append('reporterId',e.Report)
        formData.append('priority',e.priority)
        formData.append('startDate',e.start_date)
        formData.append('dueDate',e.last_date)
        formData.append('attachment',e.attachment[0]);
        
        if ( projectId !== '' &&  milstoneId !== '' && SprintId !== '') {
            
            dispatch(createTask(formData));
            console.log("formdata",formData)
            // setTimeout(() => {
            //     callAlltaskData();
            // }, 1000);
            
            
        } else {
            alert('plsease select project');
        }

        setValue('Summary', '')
        setValue('Description', '')
        setValue('Assignee', '')
        setValue('Report', '')
        setValue('priority', '')
        setValue('start_date', '')
        setValue('last_date', '')
        setValue('attachment', '')
        setShowModal(false);
    };

    // useEffect(() => {
    // call click outside
    // }, []);

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
                    {/* <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            vitae nulla ut ex lobortis aliquet eu non urna. Morbi fringilla,
            nulla sit amet vulputate lobortis, justo lectus porta erat, vitae
        
          </p> */}
                </div>

                <div className="modal-body">
                    <p>{content}</p>
                    <div className="model-content-detail">
                        <form class="" onSubmit={handleSubmit(onSubmit)}>
                            <div class="row">
                                <div class="">
                                    <div class="mb-2">
                                        {/* <label class="form-label" for="exampleForm.ControlInput1">Project  <span class="text-danger">*</span>:</label> */}
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
                                        {/* <label class="form-label" for="exampleForm.ControlTextarea1">Milestone
                  <span class="text-danger">*</span>:</label> */}
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
                                        {/* <label class="form-label" for="exampleForm.ControlTextarea1">Sprint
                  <span class="text-danger">*</span>:</label> */}
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

                                {/* <div class=""><div class="mb-2"><label class="form-label" for="exampleForm.ControlInput1">Type Of Project 
         <span class="text-danger">*</span>:</label><select name="project_type" class="form-select" id="exampleForm.ControlInput1">
         <option>Choose an Project Type </option><option value="T&amp;M">T&amp;M</option><option value="Fixed Cost">Fixed Cost</option>
         <option value=" Hourly">Hourly</option><option value="Dedicated team">Dedicated team</option></select></div>
         </div> */}
                            </div>

                            <div class="row">
                              
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
                                        


                                         {/* <input
                                            placeholder="Please Enter Description"
                                            type="text"
                                            id="exampleForm.ControlInput1"
                                            class="form-control"
                                            {...register('Description')}/> */}
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
                                <div class="col-lg-6">
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
                                            <option value="">--Select--</option>
                                            {getAllUserData?.map((items, index) => <option key={index} value={items._id}>{items.firstName}</option>)}
                                            {/* {store?.getAllAssignee?.data?.response?.map((item,index)=> <option value={item?.assigneeId?._id}>{item?.assigneeId?.userName} </option>)} */}


                                        </select>

                                        {/* <input placeholder="Please Enter Assignee" type="text" id="exampleForm.ControlTextarea1" class="form-control" {...register("Assignee")} /> */}
                                    </div>
                                </div>
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
                                            <option value="">--Select--</option>
                                            {getAllRole?.map((items, index) => <option value={items._id}> {items.role} </option>)}



                                        </select>
                                        {/* <input placeholder="Please Enter Report" type="text" id="exampleForm.ControlInput1" class="form-control"  {...register("Report")} /> */}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            Start Date<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please start Date "
                                            type="date"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('start_date')}
                                        />
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-2">
                                        <label class="form-label" for="exampleForm.ControlTextarea1">
                                            End Date<span class="text-danger">*</span>:
                                        </label>
                                        <input
                                            placeholder="Please end Date"
                                            type="date"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('last_date')}
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
                                            
                                            {...register('priority')} >
                                           
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
                                            disabled="Live"
                                            name="status"
                                            placeholder="Live"
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
                                        <input
                                            placeholder="Please start Date "
                                            type="file"
                                            id="exampleForm.ControlTextarea1"
                                            class="form-control"
                                            {...register('attachment')}
                                        />
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
