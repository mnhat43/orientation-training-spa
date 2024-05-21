import React, { useEffect, useState } from 'react';
import { Button, Form, Spin, InputNumber, Popconfirm, Table, Typography, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import './index.scss';
import ModalAccount from "./modal-evaluation"
import user from 'api/user';
import { toast } from 'react-toastify';

const dataAll = [
    { fullname: 'Nguyễn Văn A', 'logical-thinking': 'A', skills: 'B', attitudes: 'A', period: 'First Evaluation', date: '2024-01-15' },
    { fullname: 'Trần Thị B', 'logical-thinking': 'B', skills: 'A', attitudes: 'B', period: 'First Evaluation', date: '2024-02-10' },
    { fullname: 'Phạm Minh C', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'First Evaluation', date: '2024-03-12' },
    { fullname: 'Lê Văn D', 'logical-thinking': 'B', skills: 'B', attitudes: 'A', period: 'First Evaluation', date: '2024-04-05' },
    { fullname: 'Võ Thị E', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'First Evaluation', date: '2024-05-10' },
    { fullname: 'Đỗ Minh F', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-06-01' },
    { fullname: 'Bùi Văn G', 'logical-thinking': 'B', skills: 'C', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-07-15' },
    { fullname: 'Hoàng Thị H', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'Midterm Evaluation', date: '2024-08-20' },
    { fullname: 'Lâm Minh I', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-09-30' },
    { fullname: 'Vũ Thị J', 'logical-thinking': 'B', skills: 'C', attitudes: 'B', period: 'Midterm Evaluation', date: '2024-10-10' },
    { fullname: 'Nguyễn Thị K', 'logical-thinking': 'A', skills: 'B', attitudes: 'A', period: 'Final Evaluation', date: '2024-11-05' },
    { fullname: 'Trần Văn L', 'logical-thinking': 'B', skills: 'A', attitudes: 'B', period: 'Final Evaluation', date: '2024-12-01' },
    { fullname: 'Phạm Thị M', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Final Evaluation', date: '2024-12-15' },
    { fullname: 'Lê Minh N', 'logical-thinking': 'B', skills: 'B', attitudes: 'A', period: 'Final Evaluation', date: '2024-12-20' },
    { fullname: 'Võ Văn O', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'Final Evaluation', date: '2024-12-25' },
];
const dataFirst = [
    { fullname: 'Nguyễn Văn A', 'logical-thinking': 'A', skills: 'B', attitudes: 'A', period: 'First Evaluation', date: '2024-01-15' },
    { fullname: 'Trần Thị B', 'logical-thinking': 'B', skills: 'A', attitudes: 'B', period: 'First Evaluation', date: '2024-02-10' },
    { fullname: 'Phạm Minh C', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'First Evaluation', date: '2024-03-12' },
    { fullname: 'Lê Văn D', 'logical-thinking': 'B', skills: 'B', attitudes: 'A', period: 'First Evaluation', date: '2024-04-05' },
    { fullname: 'Võ Thị E', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'First Evaluation', date: '2024-05-10' },
];
const dataMidterm = [
    { fullname: 'Đỗ Minh F', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-06-01' },
    { fullname: 'Bùi Văn G', 'logical-thinking': 'B', skills: 'C', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-07-15' },
    { fullname: 'Hoàng Thị H', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'Midterm Evaluation', date: '2024-08-20' },
    { fullname: 'Lâm Minh I', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Midterm Evaluation', date: '2024-09-30' },
    { fullname: 'Vũ Thị J', 'logical-thinking': 'B', skills: 'C', attitudes: 'B', period: 'Midterm Evaluation', date: '2024-10-10' },
];
const dataFinal = [
    { fullname: 'Nguyễn Thị K', 'logical-thinking': 'A', skills: 'B', attitudes: 'A', period: 'Final Evaluation', date: '2024-11-05' },
    { fullname: 'Trần Văn L', 'logical-thinking': 'B', skills: 'A', attitudes: 'B', period: 'Final Evaluation', date: '2024-12-01' },
    { fullname: 'Phạm Thị M', 'logical-thinking': 'A', skills: 'A', attitudes: 'A', period: 'Final Evaluation', date: '2024-12-15' },
    { fullname: 'Lê Minh N', 'logical-thinking': 'B', skills: 'B', attitudes: 'A', period: 'Final Evaluation', date: '2024-12-20' },
    { fullname: 'Võ Văn O', 'logical-thinking': 'C', skills: 'B', attitudes: 'B', period: 'Final Evaluation', date: '2024-12-25' },
];

const ManageEvaluation = () => {
    const [form] = Form.useForm();
    const dataModalDefault = {
        key: "",
        user_id: "",
        fullname: "",
        username: "",
        email: "",
        phone_numbers: "",
        address: "",
        city: "",
        country: "",
        created_at: "",
    }
    const [valueTags, setValueTags] = useState('all');
    const [listEvaluation, setListEvaluation] = useState(dataAll);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState('');
    const [dataModal, setDataModal] = useState({});

    const onChangeTags = (key) => {
        setValueTags(key)
        switch (key) {
            case 'all':
                setListEvaluation(dataAll);
                break;
            case 'first':
                setListEvaluation(dataFirst);
                break;
            case 'mid':
                setListEvaluation(dataMidterm);
                break;
            case 'final':
                setListEvaluation(dataFinal);
                break;
            default:
                setListEvaluation(dataAll);
                break;
        }
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setAction('');
        setDataModal(dataModalDefault);
        form.resetFields();
    };

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleCancel = () => {
        setDataModal(dataModalDefault);
        setAction('');
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCreate = () => {
        setDataModal(dataModalDefault);
        setAction("CREATE");
        showModal();
    };

    const fetchData = async () => {
        const data = (await user.getAllAccount()).data;
        const modifiedData = data.map((item) => {
            let newItem = {
                ...item,
                key: item.user_id,
                created_at: convertDate(item.created_at)
            }
            return newItem;
        });
        setListAccount(modifiedData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Trainee Name',
            dataIndex: 'fullname',
            fixed: 'left',
        }, {
            title: 'Logical Thinking',
            dataIndex: 'logical-thinking',
        },
        {
            title: 'Skills',
            dataIndex: 'skills',
        },
        {
            title: 'Attitudes',
            dataIndex: 'attitudes',
        },
        {
            title: 'Period',
            dataIndex: 'period',
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Update',
            width: 95,
            render: (text, record) => {
                const handleUpdate = () => {
                    setAction("UPDATE");
                    setDataModal(record);
                    showModal();
                }
                return (
                    <Button onClick={() => handleUpdate()}  >
                        <EditOutlined style={{ fontSize: '20px', color: 'orange' }} />
                    </Button >
                )
            },
            fixed: 'right',
        },
        {
            title: 'Delete',
            width: 90,
            render: (text, record) => {
                const handleDelete = async () => {
                    // await user.deleteUser(record.user_id);
                    toast.success("Xóa khách hàng thành công!")
                    // fetchData();
                }
                return (
                    <Popconfirm
                        title="Xóa khách hàng"
                        description="Bạn có chắc chắn muốn xóa?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete()}
                    >
                        <Button danger>
                            <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
                        </Button>
                    </Popconfirm>
                )
            },
            fixed: 'right',
        },
    ];


    const itemsTags = [
        {
            key: 'all',
            label: 'All Evaluation',
            children: <></>,
        },
        {
            key: 'first',
            label: 'First Evaluation',
            children: <></>,
        },
        {
            key: 'mid',
            label: 'Midterm Evaluation',
            children: <></>,
        },
        {
            key: 'final',
            label: 'Final Evaluation',
            children: <></>,
        },
    ];

    return (
        <>
            <div className="manage-evaluation__container">
                <h1> Evaluation List</h1>
                <Tabs defaultActiveKey="trainer" items={itemsTags} onChange={onChangeTags} />
                <div className="manage-evaluation__content">
                    <Button onClick={handleCreate} type="primary" style={{ marginBottom: 16 }} >
                        <PlusOutlined />Create a new evaluation
                    </Button>
                    {
                        listEvaluation && listEvaluation.length > 0
                            ?
                            <Table
                                columns={columns}
                                dataSource={listEvaluation}
                                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                                bordered
                                scroll={{
                                    x: 1500,
                                }}
                            />
                            :
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                                style={{
                                    height: '100vh',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            />
                    }
                </div>

            </div>

            <ModalAccount
                form={form}
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                action={action}
                dataModal={dataModal}
                fetchData={fetchData}
            />
        </>

    )
}

export default ManageEvaluation;