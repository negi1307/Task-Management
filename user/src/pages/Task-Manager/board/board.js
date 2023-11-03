import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { columnsFromBackend } from './data';
import { DragDropContext, Droppable,Draggable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { getAllTask, updateTask } from '../../../redux/actions';
import { v4 as uuidv4 } from 'uuid';
import MainLoader from '../../../constants/Loader/loader';
import RightBar from '../../../layouts/AddRightSideBar';
import {updateTaskStatus} from '../../../../src/redux/task/action';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {getsingleMileStone} from '../../../redux/milestone/action'
import {getAllMilstoneSprints} from '../../../redux/sprint/action'
import {getAllProjects} from '../../../redux/projects/action'
import {getHistory} from '../../../redux/addcomment/actions'

const Container = styled.div`
  display: flex;
`;


const TaskList = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: #f3f3f3;
  min-width: 341px;
  border-radius: 5px;
  padding: 15px 15px;
  margin-right: 45px;
`;

const TaskColumnStyles = styled.div`
  margin: 8px;
  display: flex;
  width: 100%;
  min-height: 80vh;
`;

const Title = styled.span`
  color: #10957d;
  background: rgba(16, 149, 125, 0.15);
  padding: 2px 10px;
  border-radius: 5px;
  align-self: flex-start;
`;


const Boards = (props) => {  
  const dispatch = useDispatch();
  const store = useSelector(state => state)
  console.log("storeeeee board",store)
  
  const successHandle = store?.getAllTaskReducer;
  const statushandle = store?.updateTaskStatus;
 
const projectId=store?.getProjectId?.data
const milstoneId=store?.getMilestoneId?.data
const SprintId=store?.getSprintId?.data



  useEffect(() => {
    dispatch(getAllTask({id:projectId , mileStoneId:milstoneId,sprintId:SprintId,activeStatus: 1 }))
    
    let body = {
      status :1,
      skip: 0    
  };

  dispatch(getAllProjects(body));

  
  }, [SprintId])

  const [showModal, setShowModal] = useState(false);
  const [destinationId, setDestinationId] = useState('');
  const [columns, setColumns] = useState(columnsFromBackend);

  const onDragEnd = (result, columns, setColumns) => {
  
    if (!result.destination) return;
    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      if(destColumn.title == "In Progress"){
        let body = {
          taskId: result?.draggableId,
          status: 2
        }
          dispatch(updateTaskStatus(body))
      }
      else if(destColumn.title == "Hold"){
        let body = {
          taskId: result?.draggableId,
          status: 3
        }
        console.log("update",body)
       // dispatch(updateTaskStatus(body))
      }
      else if(destColumn.title == "Done"){
        let body = {
          taskId: result?.draggableId,
          status: 4
        }
        dispatch(updateTaskStatus(body))
      }
     else if(destColumn.title == "To-do"){
        let body = {
          taskId: result?.draggableId,
          status: 1
        }
        dispatch(updateTaskStatus(body))
       
      }
      dispatch(getAllTask({id:projectId , mileStoneId:milstoneId,sprintId:SprintId,activeStatus: 1 }))
    } 
    else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
        
      });
     
    }
  };

  useEffect(()=>{
    dispatch(getHistory())
  },[])

  
  useEffect(() => {
  

    if (successHandle?.data?.status == 200) {
      setColumns({
        [uuidv4()]: {
          title: 'To-do',
          items: successHandle?.data?.todo?.tasks?.map((ele) => { return { ...ele, id: ele._id } }),
        },
        [uuidv4()]: {
          title: 'In Progress',
          items: successHandle?.data?.inProgress?.tasks?.map((ele) => { return { ...ele, id: ele._id } }),
        },
        
        [uuidv4()]: {
          title: 'Hold',
          items: successHandle?.data?.hold?.tasks?.map((ele) => { return { ...ele, id: ele._id }}),
      },
        [uuidv4()]: {
          title: 'Done',
          items: successHandle?.data?.done?.tasks?.map((ele) => { return { ...ele, id: ele._id } }),
        },
      })
    }
  }, [successHandle])

 // const [body,setBody] = useState({});
 const handelupdatetask = (ele) => {
  let body = {
      taskId: ele?.draggableId,
      status: ele?.destination?.droppableId,
  };
  dispatch(updateTaskStatus(body));
  dispatch(getAllTask({projectId:projectId , milestoneId:milstoneId , sprintId:SprintId}));
};
  
  const callAlltaskData=()=>{
    dispatch(getAllTask({projectId:projectId , milestoneId:milstoneId , sprintId:SprintId}));
  }

  
 
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (

    <>

     <div className='add_task'>
     <button
          type="button"
          className="mybutton btn btn-info"
          onClick={() => {
            console.log("button click");
            setShowModal(!showModal);
            
          }}
        >
          Add Task
        </button>
        <RightBar  callAlltaskData={callAlltaskData} className="d-none" projectId={props.projectId} mileStoneId={props.mileStoneId} sprintId={props.sprintId} showModal={showModal} setShowModal={setShowModal}/>
     </div>

      <DragDropContext  onDragEnd={(result) => onDragEnd(result, columns, setColumns)} 

      >
        {successHandle.loading ? (<MainLoader />) : <Container>
          <TaskColumnStyles >
            {Object.entries(columns).map(([columnId, column], index) => {
             
              return (
                <Droppable key={columnId} droppableId={columnId}>
                
                  {(provided, snapshot) => (
                    <TaskList class="three" 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      
                    > 
                      <Title class="">{column.title}</Title>
                      {column.items.map((item, index) => (
                        <TaskCard  key={item.id} item={item} index={index}  />
                      ))}
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              );
            })}
          </TaskColumnStyles>
        </Container>}

      </DragDropContext>
     
    
    </>

  );
};

export default Boards;
