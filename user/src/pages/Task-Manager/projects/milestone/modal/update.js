import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import ToastHandle from '../../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { updateMileStone } from '../../../../../redux/milestone/action';
// import MainLoader from '../../../../constants/Loader/loader';
import { Container, Form } from 'react-bootstrap';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const Update = ({ modal, closeModal, editData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const sucesshandel = store?.updateMilestone;
    const [description, setDescription] = useState('');
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    console.log(editorState, 'stttttt');
    useEffect(() => {
        reset({
            title: editData?.milestoneId?.title,
            startDate: handleDate(editData?.milestoneId?.startDate),
            endDate: handleDate(editData?.milestoneId?.completionDate),
        });
        setDescription(editData?.description);
    }, [modal]);
    const handleDate = (data) => {
        let date = new Date(data);
        let year = date.toLocaleString('default', { year: 'numeric' });
        let month = date.toLocaleString('default', { month: '2-digit' });
        let day = date.toLocaleString('default', { day: '2-digit' });
        let formattedDate = year + '-' + month + '-' + day;
        return formattedDate;
    };
    const onSubmit = (data) => {
        let body = {
            _id: editData?._id,
            title: data?.title,
            description: description,
            start_date: data?.startDate,
            completion_date: data?.endDate,
        };
        dispatch(updateMileStone(body));
        closeModal('render');
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const CloseModal = () => {
        closeModal();
    };
    useEffect(() => {
        if (sucesshandel?.data?.status == 200) {
            // console.log(sucesshandel, sucesshandel?.message);
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
            <Modal show={modal} className="add_round" onHide={CloseModal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={9} className="text-end">
                                <Modal.Title id="" className="mx-auto">
                                    Update MileStone Details
                                </Modal.Title>
                            </Col>
                            <Col lg={3} className="text-end pt-2">
                                <CloseButton onClick={CloseModal} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal.Body className="py-0">
                    <div className="p-3">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <div lg={12}>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Label>
                                            Title<span className="text-danger">*</span>:
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Please Enter Project Name"
                                            {...register('title', { required: true })}
                                        />
                                        {errors.title?.type === 'required' && (
                                            <span className="text-danger"> This feild is required *</span>
                                        )}
                                    </Form.Group>
                                </div>
                                <Col lg={12}>
                                    <Form.Group
                                        className="mb-2 border d-flex align-content-center flex-column"
                                        controlId="exampleForm.ControlTextarea1">
                                        <Form.Label className="mb-0">
                                            Description <span className="text-danger">*</span>:
                                        </Form.Label>
                                        <CKEditor
                                            config={{
                                                ckfinder: {
                                                    // Upload the images to the server using the CKFinder QuickUpload command.
                                                    uploadUrl:
                                                        'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
                                                },
                                            }}
                                            editor={ClassicEditor}
                                            data={description}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setDescription(data);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col lg={12}>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>
                                            Start Date<span className="text-danger">*</span>:
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
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
            </Modal>
        </>
    );
};

export default Update;
