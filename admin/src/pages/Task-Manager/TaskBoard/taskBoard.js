import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Boards from '../board/board';
import Summary from '../Summary/summary';
import TaskList from '../TaskList/list';
const TaskBoard = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const navigate=useNavigate()

console.log(projectId,'testing--')
// useEffect(()=>{
//   if(projectId!==null) {
//     let url=`/dashboard/boards/projectId=/${projectId}&milestoneId=/${milestoneId}&spriteId=/${spriteId}`
//     navigate(url)
//   }
// },[projectId])
    
    return (
        <>
            <div className="taskinfo">
                <ul>
                    <li>
                        {' '}
                        <Link to="/summary">Summary</Link>{' '}
                    </li>
                    <li>
                        {' '}
                        <Link to="/taskList">List</Link>{' '}
                    </li>
                    <li>
                        {' '}
                        <Link
                            to={`/dashboard/boards/projectId=/${projectId}&milestoneId=/${milestoneId}&spriteId=/${spriteId}`}>
                            Board
                        </Link>{' '}
                    </li>
                </ul>
            </div>

            <div>
              <Boards/>
              <Summary/>
              <TaskList/>
            </div>
        </>
    );
};

export default TaskBoard;
