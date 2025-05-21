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

  // Dynamic calculation of how many items to show based on screen width
  const visibleItems = useMemo(() => {
    // Show all items on large screens (desktops & large tablets)
    if (width >= 992) {
      return navItems
    }

    // Show up to 4 items on medium tablets
    if (width >= 840) {
      return navItems.slice(0, Math.min(4, navItems.length))
    }

    // Show up to 3 items on small tablets
    if (width >= 768) {
      return navItems.slice(0, Math.min(3, navItems.length))
    }

    // On mobile, the mobile menu drawer will be used
    return navItems
  }, [navItems, width])

  // Convert navigation items to the format expected by Menu's items prop
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
