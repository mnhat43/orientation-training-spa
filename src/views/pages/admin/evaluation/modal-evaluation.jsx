import { useEffect } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';

// const onChange = (key) => {
//   console.log(key);
// };
// const items = [
//   {
//     key: '1',
//     label: 'Tab 1',
//     children: 'Content of Tab Pane 1',
//   },
//   {
//     key: '2',
//     label: 'Tab 2',
//     children: 'Content of Tab Pane 2',
//   },
//   {
//     key: '3',
//     label: 'Tab 3',
//     children: 'Content of Tab Pane 3',
//   },
// ];

const ModalAccount = (props) => {
  const { form, isModalOpen, handleOk, handleCancel,
    action, dataModal, fetchData } = props;

  const onFinish = async (values) => {
    try {
      if (action === "CREATE") {
        const res = await auth.register(values);

        if (res && res.status === 200) {
          toast.success("Thêm khách hàng thành công!");
          fetchData();
          handleOk();
        }
      } else if (action === "UPDATE") {
        const res = await user.updateUserInfo(values.user_id, {
          fullname: values.fullname,
          email: values.email,
          username: values.username,
          phone_numbers: values.phone_numbers,
          address: values.address,
          city: values.city,
          country: values.country
        })

        if (res && res.status === 201) {
          toast.success(`Chỉnh sửa thông tin khách hàng ${values.user_id} thành công!`);
          fetchData();
          handleOk();
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }


  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 }
    }
  };


  useEffect(() => {
    form.setFieldsValue({
      user_id: dataModal.user_id,
      fullname: dataModal.fullname,
      username: dataModal.username,
      email: dataModal.email,
      gender: dataModal.gender,
      phone_numbers: dataModal.phone_numbers,
      address: dataModal.address,
      city: dataModal.city,
      country: dataModal.country
    });
  }, [dataModal])

  return (
    <Modal
      title={action === "CREATE" ? "Thêm mới khách hàng" : "Cập nhật thông tin khách hàng"}
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
        name="addNewCustomer"
        onFinish={onFinish}
        style={{ maxWidth: 700, margin: '0 auto' }}
        scrollToFirstError
        initialValues={
          {
            user_id: dataModal.user_id,
            fullname: dataModal.fullname,
            username: dataModal.username,
            email: dataModal.email,
            gender: dataModal.gender,
            phone_numbers: dataModal.phone_numbers,
            address: dataModal.address,
            city: dataModal.city,
            country: dataModal.country
          }
        }
      >
        {
          action === "CREATE" ? null :
            <Form.Item
              name="user_id"
              label="ID"
            >
              <Input disabled />
            </Form.Item>
        }


        <Form.Item
          name="fullname"
          label="Họ và tên"
          rules={[{ required: true, message: 'Hãy nhập họ và tên khách hàng!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: 'Hãy nhập tên đăng nhập!' }]}

        >
          <Input disabled={action === "UPDATE"} />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!'
            },
            {
              required: true,
              message: 'Please input your E-mail!'
            }
          ]}
        >
          <Input disabled={action === "UPDATE"} />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone_numbers"
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Thành phố"
          name="city"
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Đất nước"
          name="country"
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        {
          action === "UPDATE" ? null :
            <>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập mật khẩu!'
                  }
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="password2"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Hãy xác nhận lại mật khẩu!'
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error('Mật khẩu của bạn không trùng khớp!')
                      )
                    }
                  })
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
        }

        <Form.Item
          wrapperCol={{
            offset: 14,
            span: 16
          }}
        >
          <Button type="primary" htmlType="submit"
            style={{ marginRight: "10px" }}
          >
            {action === "CREATE" ? "Thêm" : "Lưu"}
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