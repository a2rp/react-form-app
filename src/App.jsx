import FormApp from './components/FormApp'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
    return (
        <>
            <FormApp />

            <ToastContainer position="top-right" />
        </>
    )
}

export default App