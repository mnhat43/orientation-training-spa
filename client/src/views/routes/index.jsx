import loadableComponent from 'utils/loadable-component'
import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { Suspense } from "react";
import MainLayout from 'components/layouts/MainLayout'
import Register from 'views/pages/register'
import ForgotPassword from 'views/pages/forgot-password/forgot-password'
import { Rings } from 'react-loader-spinner';
import ResetPassword from 'views/pages/forgot-password/reset-password';
import Dashboard from 'views/pages/dashboard';
import ManageAccount from 'views/pages/admin/account';
import ManageEvaluation from 'views/pages/admin/evaluation';
import Courses from 'views/pages/courses';
import Modules from 'views/pages/modulesCourse';
import Lectures from 'views/pages/lectures';
import Assignments from 'views/pages/assignments';
import AssessmentCreation from 'views/pages/assessmentCreate/AssessmentCreation';

const Login = loadableComponent(() => import('views/pages/login'))

const PersonalInfo = loadableComponent(() => import('views/pages/personal-info'))

function AllRoutes() {
  return (
    <>
      <Suspense
        fallback={
          <div className='loading-container'>
            <Rings
              heigth="100"
              width="100"
              color='#1877f2'
              ariaLabel='loading'
            />
            <div>Loading data...</div>
          </div>
        }
      >
        <Routes>

          <Route path="/personal-info" element={<MainLayout component={PersonalInfo} />} />

          <Route path="/dashboard" element={<MainLayout component={Dashboard} />} />
          <Route path="/manage-account" element={<MainLayout component={ManageAccount} />} />
          <Route path="/manage-evaluation" element={<MainLayout component={ManageEvaluation} />} />


          <Route path="/courses" element={<MainLayout component={Courses} />} />
          <Route path="/course/:courseId/modules" element={<MainLayout component={Modules} />} />

          <Route path="/course/:courseId/lectures" element={<MainLayout component={Lectures} />} />
          <Route path="/course/:courseId/lectures/:lectureId" element={<MainLayout component={Lectures} />} />

          <Route path="/course/:courseId/assignments/create" element={<MainLayout component={() => <AssessmentCreation assessmentType="Assignment" />} />} />


          <Route path="/course/:courseId/assignments" element={<MainLayout component={Assignments} />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" >404</Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default AllRoutes
