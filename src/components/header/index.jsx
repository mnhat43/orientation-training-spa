import { Badge, Layout, Popover, Menu } from 'antd'
const { Header } = Layout
import { Avatar } from 'antd'
import { Link } from 'react-router-dom'
import {
  UserOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  BellOutlined,
  SearchOutlined,
  GlobalOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import './header.scss'

const HeaderRender = () => {
  // const contentNoti = (
  //   <div className='noti-container'>
  //     <div className='noti-item' style={{ borderBottom: " 1px solid #ccc" }}>
  //       <div className="noti-avatar">
  //         <Avatar size={30} icon={<UserOutlined />} style={{ padding: 0 }} />
  //       </div>
  //       <div className='noti-text'>
  //         Thêm thành công thẻ <b>Học Tiếng Nhật </b>
  //         <div style={{ color: "rgb(8, 102, 255)" }}>1 ngày trước</div>
  //       </div>
  //       <div className='seen'>

  //       </div>
  //     </div>
  //     <div className='noti-item' style={{ borderBottom: " 1px solid #ccc" }}>
  //       <div className="noti-avatar">
  //         <Avatar size={30} icon={<UserOutlined />} style={{ padding: 0 }} />
  //       </div>
  //       <div className='noti-text'>
  //         Xóa thành công thẻ <b>Điểm rèn luyện</b>
  //         <div style={{ color: "rgb(8, 102, 255)" }}>2 ngày trước</div>
  //       </div>
  //       <div className='seen'>

  //       </div>
  //     </div>
  //     <div className='noti-item' style={{ borderBottom: " 1px solid #ccc" }}>
  //       <div className="noti-avatar">
  //         <Avatar size={30} icon={<UserOutlined />} style={{ padding: 0 }} />
  //       </div>
  //       <div className='noti-text' >
  //         <span style={{ color: "rgb(176, 179, 184)" }}>Xóa thành công thẻ <b>Khóa học React </b></span>
  //         <div style={{ color: "#A5ACB8" }}>1 tuần trước</div>
  //       </div>
  //       <div className='seen' style={{ visibility: "hidden" }}>

  //       </div>
  //     </div>
  //     <div className='noti-item'>
  //       <div className="noti-avatar">
  //         <Avatar size={30} icon={<UserOutlined />} style={{ padding: 0 }} />
  //       </div>
  //       <div className='noti-text' >
  //         <span style={{ color: "rgb(176, 179, 184)" }}>Thêm thành công thẻ <b>Báo cáo ITSS </b></span>
  //         <div style={{ color: "#A5ACB8" }}>3 tuần trước</div>
  //       </div>
  //       <div className='seen' style={{ visibility: "hidden" }}>

  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <Header
      className="header-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // alignContent: 'center',
        // paddingLeft: '25px',
        background: 'white',
        borderBottom: '1px solid #ccc',
        // height: "50px"
      }}
    >
      <div className="header-wrapper__logo">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a7ec8b021aa8f242c74c6fefb029d66b5c28ea7be26ba07593ea659c8fd3147?apiKey=10b1e221f97543f5b056ca1fc29636cb&"
          alt="eTracking logo"
        />
        <div className="textLogo">Orientation</div>
        <div className="textLogo2">Training</div>
      </div>

      <div className="header-wrapper__right-side">
        <div className="header-wrapper__right-side__search">
          <SearchOutlined />
        </div>

        <div className="header-wrapper__right-side__profile">
          <Link to={'/personal-info'}>
            <Avatar
              style={{ width: '35px', height: '35px', color: 'black' }}
              size={40}
              icon={<UserOutlined />}
            />
            <span style={{ color: 'black', paddingLeft: '5px' }}>Admin</span>
          </Link>
        </div>

        <div className="header-wrapper__right-side__bell">
          {/* <Popover content={contentNoti} title="Thông báo" trigger="click" style={{ color: "red" }}> */}
          <Badge count={4} overflowCount={10} size="default">
            <BellOutlined style={{ color: 'black', fontSize: '23px' }} />
          </Badge>
          {/* </Popover> */}
        </div>

        <div className="header-wrapper__right-side__question">
          <Link to={'/help'}>
            <QuestionCircleOutlined style={{ color: 'black' }} />
          </Link>
        </div>
        <div className="header-wrapper__right-side__setting">
          <Link to={'/setting'}>
            <SettingOutlined style={{ color: 'black', fontSize: '20px' }} />
          </Link>
        </div>
      </div>
    </Header>
  )
}

export default HeaderRender
