import React, { memo, useMemo } from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import useWindowSize from '@hooks/useWindowSize'

const Navigation = ({ navItems, currentPath }) => {
  const activeKey = useMemo(
    () => currentPath.split('/')[1] || 'home',
    [currentPath],
  )

  const { width } = useWindowSize()

  const visibleItems = useMemo(() => {
    if (width >= 992) {
      return navItems
    }

    if (width >= 840) {
      return navItems.slice(0, Math.min(4, navItems.length))
    }

    if (width >= 768) {
      return navItems.slice(0, Math.min(3, navItems.length))
    }

    return navItems
  }, [navItems, width])

  const menuItems = useMemo(
    () =>
      visibleItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: <Link to={item.path}>{item.label}</Link>,
      })),
    [visibleItems],
  )

  return (
    <div className="header-navigation">
      <Menu mode="horizontal" selectedKeys={[activeKey]} items={menuItems} />
    </div>
  )
}

export default memo(Navigation)
