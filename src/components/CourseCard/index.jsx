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
          src={`data:image/png;base64,${Thumbnail}`}
          style={{
            width: '100%',
            height: 150,
            objectFit: 'cover'
          }}
        />

      }
      onClick={onClick}
    >
      <Meta title={Title} description={Description} />

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
          e.stopPropagation();
          onEdit(CourseID);
        }}
      />

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
          e.stopPropagation();
          onDelete(CourseID);
        }}
      />
    </Card>
  );
};

export default CourseCard;
