import React, { useState } from "react";
import MainLoader from "../../../../constants/Loader/loader";
import { Table, Form, Button, Card, } from 'react-bootstrap';
import CustomerCreateFrom from "../customerCreate/CustomerCreateForm";

const CustomerTable = () => {
    let getUsers = false
    const [modalShow, setModalShow] = useState(false);
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

    return (
        <div>
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-end">
                        <Button className="web_button" onClick={() => setModalShow(true)}>
                            Create Customer
                        </Button>
                    </div>
                    <div className="row mx-auto">
                        <div className="col-6 d-flex align-items-end justify-content-end">
                            <h4 className="header-title heading_data"> Customer</h4>
                        </div>
                    </div>
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
                                    {dummyDataCustomer?.map((ele, ind) => {
                                        return (
                                            <tr className="align-middle">
                                                <th scope="row">{ind + 1}</th>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.name} </span>
                                                </td>
                                                <td className="cp">
                                                    <span className="namelink"> {ele?.project} </span>
                                                </td>
                                                <td className="w-20">
                                                    <span className="namelink"> {ele?.description}</span>
                                                </td>
                                                <td>
                                                    <span className="namelink">
                                                        <Form.Check
                                                            type="switch"
                                                            checked={ele?.status}
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
                    <>
                        <CustomerCreateFrom show={modalShow}
                            onHide={() => setModalShow(false)} /></>
                </Card.Body>
            </Card>
        </div>
    )
}

export default CustomerTable