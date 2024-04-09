import { useState } from "react";
import Boards from "../board/board";
import Summary from '../Summary/summary';
import List from '../ListTask/listtask'


const TaskBoard = () => {
    const [connectComponent, setConnectComponent] = useState('Board');
    const connectComponentCheck = (type) => {
        setConnectComponent(type);
    };
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="row mx-auto border-bottom mb-2">
                        <div className="row d-flex align-items-center pb-2">
                            <div
                                className={`col-auto  cp ${connectComponent == 'Summary' ? 'Active_data' : 'InActive_data'
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
                                className={`col-auto  cp ${connectComponent == 'List' ? 'Active_data' : 'InActive_data'
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
                                className={`col-auto  cp ${connectComponent == 'Board' ? 'Active_data' : 'InActive_data'
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
                    <div>
                        {connectComponent === 'Board' ? (
                            <Boards connectComponentCheck={connectComponentCheck} />
                        ) : connectComponent === 'Summary' ? (
                            <Summary connectComponentCheck={connectComponentCheck} />
                        ) : connectComponent === 'List' ? (
                            <List connectComponentCheck={connectComponentCheck} />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>


        </>
    )
}
export default TaskBoard;