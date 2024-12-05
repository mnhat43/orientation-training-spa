import React from 'react';
import { Button, Card, Dropdown, Menu } from 'antd'
const { Meta } = Card;

const CourseCard = (props) => {
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt="example" src="https://www.freecodecamp.org/news/content/images/2021/06/Ekran-Resmi-2019-11-18-18.08.13.png" />}
    >
      <Meta title="Intern ReactJS" description="Lộ trình intern cho người mới" />
    </Card>
  )
}

export default CourseCard
