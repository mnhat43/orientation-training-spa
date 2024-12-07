import { Card, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'; // Import các icon
const { Meta } = Card;

const CourseCard = (props) => {
  const { CourseID, Title, Thumbnail, Description, onDelete, onEdit, onClick } = props;

  return (
    <Card
      key={CourseID}
      hoverable
      style={{ width: 240, position: 'relative' }}
      cover={
        <img
          alt={Title}
          src={Thumbnail}
          style={{
            width: '100%', // Đảm bảo ảnh luôn chiếm hết chiều rộng của Card
            height: 150,   // Giới hạn chiều cao cố định cho ảnh
            objectFit: 'cover' // Cắt ảnh để vừa với chiều cao và chiều rộng mà không bị méo
          }}
        />

      }
      onClick={onClick}  // Xử lý khi click vào Card
    >
      <Meta title={Title} description={Description} />

      {/* Icon chỉnh sửa ở góc dưới bên phải */}
      <Button
        icon={<EditOutlined />}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 50,
          zIndex: 10,
          backgroundColor: '#1890ff',
          color: 'white',
          fontSize: '14px'
        }}
        onClick={(e) => {
          e.stopPropagation(); // Ngừng sự kiện lan truyền
          onEdit(CourseID); // Truyền CourseID trực tiếp
        }}
      />

      {/* Icon xóa ở góc dưới bên phải */}
      <Button
        icon={<DeleteOutlined />}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 10,
          backgroundColor: 'red',
          color: 'white',
          fontSize: '14px'
        }}
        onClick={(e) => {
          e.stopPropagation(); // Ngừng sự kiện lan truyền
          onDelete(CourseID); // Truyền CourseID trực tiếp
        }}
      />
    </Card>
  );
};

export default CourseCard;
