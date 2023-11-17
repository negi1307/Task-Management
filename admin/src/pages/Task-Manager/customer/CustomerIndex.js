import React, { useState, useEffect } from "react";
import CustomerTable from "./customerTable/CustomerTable";
import HeaderMain from "../header/HeaderMain";
import { Button, Card } from "react-bootstrap"
import CustomerCreateFrom from "./customerCreate/CustomerCreateForm";
import { useDispatch } from "react-redux";
import { getPreSalesData } from "../../../redux/customer/action";
const CustomerIndex = () => {
    const dispatch = useDispatch();
    const [activeCustomer, setActiveCustomer] = useState(true);
    // model create customer and edite
    const [modalShow, setModalShow] = useState({
        item: '',
        type: '',
        dataEdit: ''
    });
    const checkModel = (items, types, data) => {
        setModalShow({ ...modalShow, item: items, type: types, dataEdit: data })
    };

    useEffect(() => {
        dispatch(getPreSalesData());
    }, []);

    return (<>
        <Card>
            <Card.Body>
                <div>
                    <HeaderMain />
                </div>
                <div className="row mx-auto">
                    <div className="d-flex col-4 mt-3">
                        {/* <div className="row d-flex align-items-center">
                            <div className={`col-auto  cp ${activeCustomer? 'Active_data' : 'InActive_data'}`}>
                                <p className="p-0 m-0 p-1 cp"
                                onClick={() => {setActiveCustomer(!activeCustomer)}}
                                >
                                    Active
                                </p>
                            </div>
                            <div className={`col-auto  cp ${!activeCustomer? 'Active_data' : 'InActive_data'}`}>
                                <p className=" p-0 m-0 p-1 cp"
                                onClick={() => {setActiveCustomer(!activeCustomer)}}
                                >
                                    Inactive
                                </p>
                            </div>
                        </div> */}
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-center">
                        <h4 className="header-title heading_data">Customer</h4>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                        <Button className="web_button" onClick={() => { checkModel(true, 'add') }}>
                            Create Customer
                        </Button>
                    </div>
                </div>
                <div>
                    <CustomerTable checkModel={checkModel} />
                </div>
                <div>
                    <>
                        <CustomerCreateFrom show={modalShow}
                            checkModel={checkModel} /></>
                </div>
            </Card.Body>
        </Card>
    </>)
}

export default CustomerIndex;