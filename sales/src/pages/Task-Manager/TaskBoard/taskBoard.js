import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Boards from '../board/board';
import Summary from '../Summary/summary';
import TaskList from '../TaskList/list';
const TaskBoard = () => {
    const { projectId, milestoneId, spriteId } = useParams();
    const [connectComponent, setConnectComponent] = useState('Board');
    const connectComponentCheck = (type) => {
        setConnectComponent(type);
    };

    return (
        <>
            <div>
                <div className="card">
                    <div className="card-body">
                        <div className="row mx-auto border-bottom mb-2">
                            <div className="row d-flex align-items-center pb-2">
                                <div
                                    className={`col-auto  cp ${
                                        connectComponent == 'Summary' ? 'Active_data' : 'InActive_data'
                                    }`}>
                                    <p
                                        className="p-0 m-0 p-1 cp"
                                        onClick={() => {
                                            connectComponentCheck('Summary');
                                        }}>
                                        {' '}
                                        Summary
                                    </p>
                                </div>

                                <div
                                    className={`col-auto  cp ${
                                        connectComponent == 'List' ? 'Active_data' : 'InActive_data'
                                    }`}>
                                    <p
                                        className="p-0 m-0 p-1 cp"
                                        onClick={() => {
                                            connectComponentCheck('List');
                                        }}>
                                        List
                                    </p>
                                </div>
                                <div
                                    className={`col-auto  cp ${
                                        connectComponent == 'Board' ? 'Active_data' : 'InActive_data'
                                    }`}>
                                    <p
                                        className=" p-0 m-0 p-1 cp"
                                        onClick={() => {
                                            connectComponentCheck('Board');
                                        }}>
                                        Board
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* <div className="taskinfo border-bottom">
                            <ul>
                                <li>
                                    {' '}
                                    <h4
                                        className="cp"
                                        onClick={() => {
                                            connectComponentCheck('Summary');
                                        }}>
                                        Summary
                                    </h4>{' '}
                                </li>
                                <li>
                                    {' '}
                                    <h4
                                        className="cp"
                                        onClick={() => {
                                            connectComponentCheck('List');
                                        }}>
                                        List
                                    </h4>{' '}
                                </li>
                                <li>
                                    {' '}
                                    <h4
                                        className="cp"
                                        onClick={() => {
                                            connectComponentCheck('Board');
                                        }}>
                                        Board
                                    </h4>{' '}
                                </li>
                            </ul>
                        </div> */}

                        <div>
                            {connectComponent === 'Board' ? (
                                <Boards connectComponentCheck={connectComponentCheck} />
                            ) : connectComponent === 'Summary' ? (
                                <Summary connectComponentCheck={connectComponentCheck} />
                            ) : connectComponent === 'List' ? (
                                <TaskList connectComponentCheck={connectComponentCheck} />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskBoard;
