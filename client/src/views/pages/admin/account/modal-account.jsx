import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import auth from 'api/auth';
import { toast } from 'react-toastify';
import user from 'api/user';


const ModalAccount = (props) => {
    const { form, isModalOpen, handleOk, handleCancel,
        dataModal, fetchData } = props;

    const onFinish = async (values) => {
        try {
            const res = await auth.register(values);

            if (res && res.status === 200) {
                toast.success("Account has been created successfully!");
                fetchData();
                handleOk();
            }
        } catch (error) {
            console.log(error);
        }


    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };



    return (
        <Modal
            title="Create account"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            width={630}
            footer={<></>}
        >
            <Form
                {...formItemLayout}
                form={form}
                name="addNewAccount"
                onFinish={onFinish}
                style={{ maxWidth: 700, margin: '0 auto' }}
                scrollToFirstError
            // initialValues={
            //     {
            //         user_id: dataModal.user_id,
            //         fullname: dataModal.fullname,
            //         username: dataModal.username,
            //         email: dataModal.email,
            //         gender: dataModal.gender,
            //         phone_numbers: dataModal.phone_numbers,
            //         address: dataModal.address,
            //         city: dataModal.city,
            //         country: dataModal.country,
            //     }
            // }
            >
                <Form.Item
                    name="firstname"
                    label="First name"
                    rules={[{ required: true, message: 'Enter first name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="lastname"
                    label="Last name"
                    rules={[{ required: true, message: 'Enter last name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone number"
                    name="phone"
                    rules={[{ required: true, message: 'Enter last phone number!', }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!', },
                        { required: true, message: 'Please input your E-mail!', },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input!', },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="password2"
                    label="Confirm password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please enter password again!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(
                                    new Error('Your passwords do not match!'),
                                )
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 14,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit"
                        style={{ marginRight: "10px" }}
                    >
                        Thêm
                    </Button>
                    <Button onClick={() => handleCancel()}>
                        Hủy
                    </Button>
                </Form.Item>
            </Form>
        </Modal >
    );
}

export default ModalAccount;