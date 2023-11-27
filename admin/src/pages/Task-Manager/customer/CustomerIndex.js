import React, { useState, useEffect } from 'react';
import HeaderMain from '../header/HeaderMain';
import { Button, Card ,Table} from 'react-bootstrap';
import {deletePreSalesData, getPreSalesData } from '../../../redux/customer/action';
import Create from './modal/create';
import MainDeleteModel from "../../../constants/deleteModel/MainDeleteModel"
import Edit from "./modal/edit"
import { useSelector, useDispatch } from "react-redux";
import ToastHandle from "../../../constants/toaster/toaster";
import MainLoader from '../../../constants/Loader/loader';
import { getAllTechnology } from '../../../redux/technology/action';
const CustomerIndex = () => {
    const store = useSelector((state) => state);
   
    const dispatch = useDispatch()

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [render, setRender] = useState(false);
    const createhandle = () => {
        setCreateModalOpen(true);
    };
    const closeModal = (val) => {
        if (val == 'render') {
            setRender(!render);
        }
       
        setCreateModalOpen(false);
        setEditModalOpen(false)
    };
    useEffect(() => {
        dispatch(getPreSalesData());
    }, [render]);
    const preSaleData = store?.getPreSaleReducer?.data?.response
    const preSaleLoading = store?.getPreSaleReducer?.loading
    const preSaleDeleteStatus = store?.deletePreSaleReducer?.deletePreSale?.status;
    const preSaleDeleteMessage = store?.deletePreSaleReducer?.deletePreSale?.message;


    // delete model
    const [deleteModel,setDeleteModel]=useState(false)
    const [deleteId,setDeleteId]=useState('')
    const [EditModalOpen,setEditModalOpen]=useState(false)
    const [editData,setEditData] =useState()
    const comfimDelete=()=>{
        dispatch(deletePreSalesData(deleteId)) 
    }
    const deleteIdGet=(id)=>{
        setDeleteId(id)
        setDeleteModel(true)
    }
const EditModalhandle=(ele)=>{
    setEditModalOpen(true)
    setEditData(ele)
}
    useEffect(() => {
        if (preSaleDeleteStatus === "200") {
            ToastHandle('success', preSaleDeleteMessage);
            dispatch(getPreSalesData());
            setDeleteModel(false)
        }
        dispatch(getAllTechnology())
    }, [preSaleDeleteStatus])
    return (
        <>
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
                            <Button className="web_button" onClick={createhandle}>
                                Create Customer
                            </Button>
                        </div>
                    </div>
                    <div>
                    <div>
            {preSaleLoading ? (
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
                            <th> Type</th>
                            <th> Stage</th>
                            <th> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {preSaleData?.map((ele, ind) => {
                                console.log(ele?.stage, '=-')
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
                                            <span className="namelink"> {ele?.description?.slice(0, 10)
                                                .concat("...")}</span>
                                        </td>
                                        <td>
                                            <span className="namelink">
                                                {ele?.status === 1 ?
                                                    <>CONVERTED</> :
                                                    ele?.status === 2 ? <>NOT-CONVERTED</> : ""}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="namelink">
                                                {ele?.stage === 1 ? <>HOT</> : ele?.stage === 2 ? <>COLD</> : ele?.stage === 3 ? <>MEDIUM</> : <></>}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="namelink">
                                             
                                            </span>
                                        </td>
                                        <td>
                                            <span className="namelink">
                                                <span>
                                                    <i class="bi bi-pencil-square" onClick={() => { EditModalhandle( ele) }}></i>
                                                </span>
                                                <span className="ms-2">
                                                    <i class="bi bi-trash" onClick={() =>  {deleteIdGet(ele?._id)}}></i>
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </>
                    </tbody>
                </Table>
            )}
            <MainDeleteModel deleteModel={deleteModel} onHide={()=>setDeleteModel(false)} comfimDelete={comfimDelete}/>
            <Edit modal={EditModalOpen} editData={editData} closemodal={closeModal}/>
        </div>
                </div>
                    <div>
                        <>
                            <Create modal={createModalOpen} closemodal={closeModal} />
                        </>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default CustomerIndex;
