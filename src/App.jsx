import { ToastContainer } from "react-toastify";
import FormApp from "./components/FormApp";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
    <>
        <SiteHeader />
        <main className="pageContent"><FormApp /></main>
        <SiteFooter />
        <ToastContainer position="bottom-right" />
    </>
);

export default App;
