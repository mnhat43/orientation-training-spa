import { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [collapsed, setCollapsed] = useState(localStorage.getItem('collapsed') === 'true');
  const [authData, setAuthData] = useState(null);

  // UseEffect để đọc token khi ứng dụng được tải lại
  useEffect(() => {
    const token = localStorage.getItem('token');

    // Kiểm tra nếu token tồn tại và hợp lệ
    if (token) {
      try {
        // Cố gắng parse token và lưu vào state
        const parsedToken = JSON.parse(token);
        setIsLoggedIn(true);
        setAuthData(parsedToken); // Lưu token vào state
      } catch (error) {
        console.error('Invalid token in localStorage', error);
        setIsLoggedIn(false);
        setAuthData(null);
      }
    }
  }, []);

  // Hàm lưu token vào localStorage và cập nhật state
  const setUserInfo = (token) => {
    const cleanedToken = token.replace(/^"|"$/g, '');
    setIsLoggedIn(true);
    setAuthData(cleanedToken); // Cập nhật token vào state

    // Lưu token vào localStorage
    try {
      localStorage.setItem('token', JSON.stringify(cleanedToken));
    } catch (error) {
      console.error('Error saving token to localStorage', error);
    }
  };

  // Hàm logout (xóa token và reset state)
  const logout = () => {
    setIsLoggedIn(false);
    setAuthData(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        setUserInfo, // Cung cấp hàm lưu token vào state và localStorage
        logout,
        isLoggedIn,
        setIsLoggedIn,
        authData,
        setAuthData,
        collapsed,
        setCollapsed
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
