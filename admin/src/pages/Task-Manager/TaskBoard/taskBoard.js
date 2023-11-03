import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Boards from '../board/board';
import Summary from '../Summary/summary';
import TaskList from '../TaskList/list';
const TaskBoard = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const [connectComponent, setConnectComponent] = useState("Board");
    const connectComponentCheck = (type) => {
      setConnectComponent(type)

    };

    return (
        <>

            <div className="taskinfo">
                <ul>
                    <li>
                        {' '}
                        <h4 className='cp'
                            onClick={() => {
                                connectComponentCheck("Summary");
                            }}>
                            Summary
                        </h4>{' '}
                    </li>
                    <li>
                        {' '}
                        <h4 className='cp'
                            onClick={() => {
                                connectComponentCheck("List");
                            }}>
                            List
                        </h4 >{' '}
                    </li>
                    <li>
                        {' '}
                        <h4 className='cp'
                            onClick={() => {
                                connectComponentCheck("Board");
                            }}>
                            Board
                        </h4>{' '}
                    </li>
                </ul>
            </div>

            <div>
                {connectComponent === "Board" ? (
                    <Boards connectComponentCheck={connectComponentCheck} />
                ) : connectComponent === "Summary" ? (
                    <Summary connectComponentCheck={connectComponentCheck} />
                ) : connectComponent === "List" ? (
                    <TaskList connectComponentCheck={connectComponentCheck} />
                ) : (
                    ''
                )}
            </div>
        </>
    );
};

export default TaskBoard;
