import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import ToastHandle from '../../../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { updateSprint } from '../../../../../../redux/sprint/action';
import MainLoader from '../../../../../../constants/Loader/loader';
// import MainLoader from '../../../../constants/Loader/loader';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const Update = ({ modal, closeModal, editData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [description, setDescription] = useState('');
    const sucesshandel = store?.updateSprint;
    const loaderhandel = store?.updateSprint;
    // disable previous date
    const today = new Date().toISOString().split('T')[0];
    // start date
    function findMinimumStartDate(startdate1, startdate2) {
        return new Date(Math.min(new Date(startdate1), new Date(startdate2)));
    }
    const startdate1 = new Date();
    const startdate2 = editData?.startDate;
    const minimumStartDate = findMinimumStartDate(startdate1, startdate2);
    //
    // end date
    function findMinimumEndDate(date1, date2) {
        return new Date(Math.min(new Date(date1), new Date(date2)));
    }
    const date1 = new Date();
    const date2 = editData?.endDate;
    const minimumEndDate = findMinimumEndDate(date1, date2);
    //
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const CloseModaal = () => {
        closeModal();
    };
    const onSubmit = (data) => {
        let body = {
            sprintId: editData?._id,
            sprintName: data?.title,
            sprintDesc: data?.description,
            startDate: data?.startDate,
            endDate: data?.endDate,
        };
        console.log('editsprit', body);
        dispatch(updateSprint(body));
    };
    useEffect(() => {
        reset({
            title: editData?.sprintName,
            startDate: handleDate(editData?.startDate),
            endDate: handleDate(editData?.endDate),
            description: editData?.sprintDesc,
        });
    }, [modal]);
    console.log(editData, 'pppppp');
    const handleDate = (data) => {
        let date = new Date(data);
        let year = date.toLocaleString('default', { year: 'numeric' });
        let month = date.toLocaleString('default', { month: '2-digit' });
        let day = date.toLocaleString('default', { day: '2-digit' });
        let formattedDate = year + '-' + month + '-' + day;
        return formattedDate;
    };
    useEffect(() => {
        if (sucesshandel?.data?.status == 200) {
            ToastHandle('success', 'Updated Successfully');
            closeModal('render');
        } else if (sucesshandel?.data?.status == 400) {
            ToastHandle('error', sucesshandel?.data?.message);
        } else if (sucesshandel?.data?.status == 500) {
            ToastHandle('error', sucesshandel?.data?.message);
        }
    }, [sucesshandel]);
    return (
        <>
            <Modal show={modal} onHide={CloseModaal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={8} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Update Sprint Detail
                                </Modal.Title>
                            </Col>
                            <Col lg={4} className="text-end pt-2">
                                <CloseButton onClick={CloseModaal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {loaderhandel.loading ? (
                    <MainLoader />
                ) : (
                    <Modal.Body className="py-0">
                        <div className="p-3">
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                            <Form.Label>
                                                Sprint Name<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Please Enter Sprint Name"
                                                {...register('title', { required: true })}
                                            />
                                            {errors.title?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2 border" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Description <span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Please Enter Description"
                                                type="text"
                                                {...register('description', { required: true })}
                                            />
                                            {errors.description?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                Start Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                min={handleDate(minimumStartDate)}
                                                {...register('startDate', { required: true })}
                                                placeholder="Please start Date "
                                            />
                                            {errors.startDate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>
                                                End Date<span className="text-danger">*</span>:
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                min={watch('startDate')}
                                                {...register('endDate', { required: true })}
                                                placeholder="Please end Date"
                                            />
                                            {errors.endDate?.type === 'required' && (
                                                <span className="text-danger"> This feild is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="text-start d-flex align-items-center justify-content-center">
                                        <Button
                                            variant="info"
                                            type="submit"
                                            className="btn btn-sm  text-white pt-1 pb-1 mt-3 web_button ">
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Modal.Body>
                )}
            </Modal>
        </>
    );
};

export default Update;
