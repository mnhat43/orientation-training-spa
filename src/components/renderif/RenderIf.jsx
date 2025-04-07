import React from 'react'

const RenderIf = ({ children, isShow }) => {
  return <>{isShow ? children : null}</>
}

export default RenderIf
