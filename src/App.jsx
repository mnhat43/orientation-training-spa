import AllRoutes from '@views/routes'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from '@providers/AuthProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  return (
    <>
      {/* <UserProvider> */}
      <AuthProvider>
        <BrowserRouter>
          {/* <GlobalHistory /> */}
          <AllRoutes />
        </BrowserRouter>
      </AuthProvider>
      {/* </UserProvider> */}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
