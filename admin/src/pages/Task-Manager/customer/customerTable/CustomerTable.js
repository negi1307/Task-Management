import React, { useEffect, useState } from "react";
import MainLoader from "../../../../constants/Loader/loader";
import { Table, Form } from 'react-bootstrap';
import { getPreSalesData } from "../../../../redux/customer/action";
import { useSelector } from "react-redux";

const CustomerTable = () => {
    let getUsers = false
    const dummyDataCustomer = [{
        name: "testing",
        project: 'task management',
        description: 'testing',
        status: true
    },
    {
        name: "testing",
        project: 'task management',
        description: 'testing',
        status: true
    },
    {
        name: "testing",
        project: 'task management',
        description: 'testing',
        status: true
    }]
    const store = useSelector((state) => state);
    const preSaleData=store?.getPreSaleReducer?.data?.response

    
    return (
        <div>
            {getUsers?.loading ? (
                <MainLoader />
            ) : (
                <Table className="mb-0 add_Color_font" striped>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th> First Name</th>
                            <th>Project</th>
                            <th>Description</th>
                            <th> Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {preSaleData?.map((ele, ind) => {
                                console.log(ele,'*')
                                return (
                                    <tr className="align-middle">
                                        <th scope="row">{ind + 1}</th>
                                        <td className="cp">
                                            <span className="namelink"> {ele?.clientName} </span>
                                        </td>
                                        <td className="cp">
                                            <span className="namelink"> {ele?.projectName} </span>
                                        </td>
                                        <td className="w-20">
                                            <span className="namelink"> {ele?.description}</span>
                                        </td>
                                        <td>
                                            <span className="namelink">
                                                <Form.Check
                                                    type="switch"
                                                    checked={ele?.status===1?true:false}
                                                // onChange={(e) => handleStatusChange(e, ele)}
                                                />
                                                {/* {moment(ele?.createdAt).format('L')} */}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </>
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default CustomerTable