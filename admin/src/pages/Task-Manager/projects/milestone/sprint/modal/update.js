import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import ToastHandle from '../../../../../../constants/toaster/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { updateSprint } from '../../../../../../redux/sprint/action';
import MainLoader from '../../../../../../constants/Loader/loader';
import DatePicker from 'react-datepicker';
import '../../../../../../../node_modules/react-datepicker/dist/react-datepicker.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { parseISO } from 'date-fns';
const Update = ({ modal, closeModal, editData }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const sucesshandel = store?.updateSprint;
    const loaderhandel = store?.updateSprint;

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // disable previous date
    const today = new Date();
    // console.log(today, 'today');
    // end date
    const handleStartDate = (date) => {
        setStartDate(date);
    };
    const handleEndDate = (date) => {
        setEndDate(date);
    };
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
            startDate: startDate,
            endDate: endDate,
        };
        console.log('editsprit', body);
        dispatch(updateSprint(body));
    };
    useEffect(() => {
        reset({
            title: editData?.sprintName,
            description: editData?.sprintDesc,
        });
        if (editData?.startDate || editData?.endDate) {
            const parsedDate = parseISO(editData?.startDate)
            const endate = parseISO(editData?.endDate)
            if (parsedDate || endate) {
                setStartDate(parsedDate);
                setEndDate(endate)
            } else {
                console.error('Invalid date format:', editData.startDate);
            }
        }
    }, [modal]);
    // console.log(editData, 'pppppp');

    useEffect(() => {
        if (sucesshandel?.data?.status == 200) {
            ToastHandle('success', 'Updated Successfully');
            closeModal('render');
        } else if (sucesshandel?.data?.status == 400) {
            ToastHandle('error', sucesshandel?.data?.message);
        } else if (sucesshandel?.data?.status == 500) {
            ToastHandle('error', sucesshandel?.data?.message);
        }
    }, [sucesshandel?.data?.status]);
    return (
        <>
            <Modal show={modal} onHide={CloseModaal}>
                <Row className="m-0 p-0">
                    <Col lg={12}>
                        <Row>
                            <Col lg={12} className="text-end pt-2">
                                <button type="button" className="close border-0 bg-black text-white" onClick={CloseModaal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </Col>
                            <Col lg={12} className="text-center">
                                <Modal.Title id="" className="mx-auto modal_titles">
                                    Update Sprint Detail
                                </Modal.Title>
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
                                                {...register('title', { required: true, pattern: /^[^\s]+$/ })}
                                            />
                                            {errors.title?.type === 'required' && (
                                                <span className="text-danger"> This field is required *</span>
                                            )}

                                            {errors.title?.type === 'pattern' && (
                                                <span className="text-danger">Empty fields / space at first character is not allowed</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2 " controlId="exampleForm.ControlTextarea1">
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
                                                <span className="text-danger"> This field is required *</span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="w-100">
                                                Start Date<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <DatePicker
                                                selected={startDate}
                                                // onChange={(date) => setStartDate(date)}
                                                onChange={(date) => handleStartDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={today}
                                                className="add_width_input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="w-100">
                                                End Date<span className="text-danger">*</span>:
                                            </Form.Label>

                                            <DatePicker
                                                selected={endDate}
                                                disabled={startDate == '' || startDate == undefined}
                                                // onChange={(date) => setEndDate(date)}
                                                onChange={(date) => handleEndDate(date)}
                                                placeholderText="mm-dd-yyyy"
                                                minDate={startDate}
                                                className="add_width_input"
                                            />
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
