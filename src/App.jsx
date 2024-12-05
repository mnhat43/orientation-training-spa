import AllRoutes from '@views/routes'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from '@context/UserContext'
import { ToastContainer } from 'react-toastify'
import { GlobalHistory } from '@components/globalhistory'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <GlobalHistory />
          <AllRoutes />
        </BrowserRouter>
      </UserProvider>

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
