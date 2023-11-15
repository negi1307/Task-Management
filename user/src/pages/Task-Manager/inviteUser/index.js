import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Row, Col, Card, Button, Alert, CloseButton } from 'react-bootstrap';
import { inviteUser } from '../../../redux/user/action';
import ToastHandle from '../../../constants/toaster/toaster';
const InviteUser = () => {
    const dispatch = useDispatch();

    const store = useSelector((state) => state);
    const successHandle = store?.createUser?.data;
    const roleid = store?.Auth?.user?.id;
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        let body = {
            userName: data?.title,
            password: data?.password,
            email: data?.email,
            roleId: roleid,
        };
        dispatch(inviteUser(body));
    };
    useEffect(() => {
        if (successHandle?.status == 200) {
            ToastHandle('success', 'User created successfully');
            reset();
        } else if (successHandle?.status == 400) {
            ToastHandle('error', successHandle?.data?.message);
        } else if (successHandle?.status == 500) {
            ToastHandle('error', successHandle?.data?.message);
        }
    }, [successHandle]);

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="pt-4">
                    <Col lg={4}>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                            <Form.Label>
                                Name<span className="text-danger">*</span>:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Please Enter  Name"
                                {...register('title', { required: true })}
                            />
                            {errors.title?.type === 'required' && (
                                <span className="text-danger"> This feild is required *</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                                Email<span className="text-danger">*</span>:
                            </Form.Label>
                            <Form.Control
                                type="mail"
                                placeholder="Please Enter e-mail"
                                {...register('email', { required: true })}
                            />
                            {errors.email?.type === 'required' && (
                                <span className="text-danger"> This feild is required *</span>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={4}>
                        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                                Password<span className="text-danger">*</span>:
                            </Form.Label>
                            <Form.Control
                                type="password"
                                {...register('password', { required: true })}
                                placeholder="Please enter password"
                            />
                            {errors.password?.type === 'required' && (
                                <span className="text-danger"> This feild is required *</span>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {' '}
                        <Button type="submit" className=" web_button">
                            Invite
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default InviteUser;
