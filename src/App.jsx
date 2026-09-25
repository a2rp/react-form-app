import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import FormApp from "./components/FormApp";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const [showGoTop, setShowGoTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowGoTop(window.scrollY > 420);

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <SiteHeader />
            <main className="pageContent"><FormApp /></main>
            <SiteFooter />
            {showGoTop && <button className="goTopButton" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top" title="Go to top"><FiArrowUp /></button>}
            <ToastContainer position="bottom-right" />
        </>
    );
};

export default App;