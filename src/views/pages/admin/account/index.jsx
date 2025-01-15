import { useEffect, useState } from 'react'
import { Button, Form, Spin, Popconfirm, Table, Tabs } from 'antd'
import { DeleteOutlined, PlusOutlined, LoadingOutlined, ProfileOutlined } from '@ant-design/icons'
import './index.scss'
import ModalAccount from './modal-account'
import user from '@api/user'
import { toast } from 'react-toastify'

const dataTree = [
  { id: 10, firstname: 'Hà', lastname: 'Nguyễn', email: 'ha.nguyen@example.com', phone: '0901234567', address: '123 Đường Lê Lợi, Quận 1, TP.HCM', created_at: '2024-01-15' },
  { id: 9, firstname: 'An', lastname: 'Trần', email: 'an.tran@example.com', phone: '0902345678', address: '456 Đường Hai Bà Trưng, Quận 3, TP.HCM', created_at: '2024-02-10' },
  { id: 8, firstname: 'Bình', lastname: 'Phạm', email: 'binh.pham@example.com', phone: '0903456789', address: '789 Đường Nguyễn Huệ, Quận 1, TP.HCM', created_at: '2024-03-12' },
  { id: 7, firstname: 'Dũng', lastname: 'Lê', email: 'dung.le@example.com', phone: '0904567890', address: '101 Đường Lý Thường Kiệt, Quận 10, TP.HCM', created_at: '2024-04-05' },
  { id: 6, firstname: 'Trang', lastname: 'Võ', email: 'trang.vo@example.com', phone: '0905678901', address: '102 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM', created_at: '2024-05-10' }
]
const dataTrainer = [
  { id: 5, firstname: 'Phúc', lastname: 'Hoàng', email: 'phuc.hoang@example.com', phone: '0906789012', address: '103 Đường Trần Hưng Đạo, Quận 5, TP.HCM', created_at: '2024-06-01' },
  { id: 4, firstname: 'Quang', lastname: 'Đỗ', email: 'quang.do@example.com', phone: '0907890123', address: '104 Đường Phạm Ngũ Lão, Quận 1, TP.HCM', created_at: '2024-07-15' },
  { id: 3, firstname: 'Minh', lastname: 'Huỳnh', email: 'minh.huynh@example.com', phone: '0908901234', address: '105 Đường Võ Văn Tần, Quận 3, TP.HCM', created_at: '2024-08-20' },
  { id: 2, firstname: 'Hương', lastname: 'Lâm', email: 'huong.lam@example.com', phone: '0909012345', address: '106 Đường Nguyễn Thị Minh Khai, Quận 1, TP.HCM', created_at: '2024-09-30' },
  { id: 1, firstname: 'Tùng', lastname: 'Bùi', email: 'tung.bui@example.com', phone: '0900123456', address: '107 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', created_at: '2024-10-10' }
]

const ManageAccount = () => {
  const [form] = Form.useForm()
  const dataModalDefault = {
    key: '',
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    created_at: ''
  }
  const [setValueTags] = useState('trainer')
  const [listAccount, setListAccount] = useState(dataTrainer)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataModal, setDataModal] = useState({})

  const onChangeTags = (key) => {
    setValueTags(key)
    key === 'trainer' ? setListAccount(dataTrainer) : setListAccount(dataTree)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    setDataModal(dataModalDefault)
    form.resetFields()
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setDataModal(dataModalDefault)
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleCreate = () => {
    setDataModal(dataModalDefault)
    showModal()
  }

  const convertDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `
    return formattedDate
  }

  const fetchData = async () => {
    const data = (await user.getAllAccount()).data
    const modifiedData = data.map((item) => {
      let newItem = {
        ...item,
        key: item.user_id,
        created_at: convertDate(item.created_at)
      }
      return newItem
    })
    setListAccount(modifiedData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.id - b.id,
      fixed: 'left',
      width: '60px'
    },
    {
      title: 'First Name',
      dataIndex: 'firstname',
      fixed: 'left'
    }, {
      title: 'Last Name',
      dataIndex: 'lastname',
      fixed: 'left'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '220px'
    },
    {
      title: 'Phone number',
      dataIndex: 'phone'
    },
    {
      title: 'Gender',
      dataIndex: 'gender'
    },
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'Created at',
      dataIndex: 'created_at'
    },
    {
      title: 'Profile',
      width: 95,
      render: (text, record) => {
        const handleProfile = () => {
          setDataModal(record)
          showModal()
        }
        return (
          <Button onClick={() => handleProfile()}  >
            <ProfileOutlined style={{ fontSize: '20px', color: 'blue' }} />
          </Button >
        )
      },
      fixed: 'right'
    },
    {
      title: 'Delete',
      width: 90,
      render: () => {
        const handleDelete = async () => {
          // await user.deleteUser(record.user_id)
          toast.success('Xóa khách hàng thành công!')
          // fetchData()
        }
        return (
          <Popconfirm
            title='Xóa khách hàng'
            description='Bạn có chắc chắn muốn xóa?'
            okText='Xóa'
            cancelText='Hủy'
            onConfirm={() => handleDelete()}
          >
            <Button danger>
              <DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
            </Button>
          </Popconfirm>
        )
      },
      fixed: 'right'
    }
  ]


  const itemsTags = [
    {
      key: 'trainer',
      label: 'Trainer',
      children: <></>
    },
    {
      key: 'trainee',
      label: 'Trainee',
      children: <></>
    }
  ]

  return (
    <>
      <div className='manage-account__container'>
        <h1> Account List</h1>
        <Tabs defaultActiveKey='trainer' items={itemsTags} onChange={onChangeTags} />
        <div className='manage-account__content'>
          <Button onClick={handleCreate} type='primary' style={{ marginBottom: 16 }} >
            <PlusOutlined />Create a new user
          </Button>
          {
            listAccount && listAccount.length > 0
              ?
              <Table
                columns={columns}
                dataSource={listAccount}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }}
                bordered
                scroll={{
                  x: 1500
                }}
              />
              :
              <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
                style={{
                  height: '100vh',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'center'
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
        dataModal={dataModal}
        fetchData={fetchData}
      />
    </>

  )
}

export default ManageAccount