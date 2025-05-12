import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeProfile from './EmployeeProfile';
import TrainingReports from './TrainingReports';
import './styles/manage-employee.scss';

const ManageEmployees = () => {
  return (
    <div className="manage-employees-container">
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/profile/:employeeId/*" element={<EmployeeProfile />} />
        <Route path="/reports" element={<TrainingReports />} />
        <Route path="*" element={<Navigate to="/manage-employee" replace />} />
      </Routes>
    </div>
  );
};

export default ManageEmployees;
