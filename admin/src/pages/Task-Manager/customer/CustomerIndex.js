import React,{useState,useEffect} from "react";
import CustomerTable from "./customerTable/CustomerTable";
import HeaderMain from "../header/HeaderMain";
import {Button,Card} from "react-bootstrap"
import CustomerCreateFrom from "./customerCreate/CustomerCreateForm";
import { useDispatch } from "react-redux";
import { getPreSalesData } from "../../../redux/customer/action";
const CustomerIndex =()=>{
    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);

    const [activeCustomer,setActiveCustomer]=useState(true)



    useEffect(() => {
        dispatch(getPreSalesData());
    }, []);

    return(<>
    <Card>
            <Card.Body>
                <div>
                    <HeaderMain />
                </div>
                <div className="row mx-auto">
                    <div className="d-flex col-4 mt-3">
                        <div className="row d-flex align-items-center">
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
                        </div>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-center">
                        <h4 className="header-title heading_data">Customer</h4>
                    </div>
                    <div className="col-4 d-flex align-items-center justify-content-end pe-0">
                    <Button className="web_button" onClick={() => setModalShow(true)}>
                            Create Customer
                        </Button>
                    </div>
                </div>
                <div>
                    <CustomerTable />
                </div>
                <div>
                <>
                        <CustomerCreateFrom show={modalShow}
                            onHide={() => setModalShow(false)} /></>
                </div>
            </Card.Body>
        </Card>
    </>)
}

export default CustomerIndex;