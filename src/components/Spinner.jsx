import React from 'react'
import { Spin, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const { Text } = Typography

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  width: 100%;
  padding: ${props => props.padding || '20px'};
  background-color: ${props => props.overlay ? 'rgba(255, 255, 255, 0.8)' : 'transparent'};
  position: ${props => props.overlay ? 'absolute' : 'relative'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${props => props.overlay ? 1000 : 'auto'};
  border-radius: ${props => props.borderRadius || '0'};
`

const MessageContainer = styled.div`
  margin-top: 12px;
  text-align: center;
`

const Spinner = ({
  size = 'default',
  tip,
  message,
  fullHeight = true,
  overlay = false,
  padding,
  borderRadius,
  color = '#1890ff',
  ...props
}) => {
  // Create custom spinner icon with the specified color
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'small' ? 24 : size === 'large' ? 40 : 32, color }} spin />

  return (
    <SpinnerContainer 
      fullHeight={fullHeight} 
      overlay={overlay}
      padding={padding}
      borderRadius={borderRadius}
    >
      <Spin indicator={antIcon} tip={tip} {...props} />
      
      {message && (
        <MessageContainer>
          <Text>{message}</Text>
        </MessageContainer>
      )}
    </SpinnerContainer>
  )
}

export default Spinner
