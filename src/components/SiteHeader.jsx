import { MdDescription, MdMenu } from "react-icons/md";
import styles from "./SiteHeader.module.scss";

const SiteHeader = () => (
    <header className={styles.header}>
        <div className={styles.inner}>
            <a className={styles.brand} href="/" title="React Form App home">
                <img src={import.meta.env.BASE_URL + "logo.png"} alt="Ashish Ranjan logo" />
                <span><small>A2RP</small>React Form App</span>
            </a>
            <nav className={styles.nav} aria-label="Primary navigation">
                <a href="#form"><MdDescription />Form</a>
                <a href="#features"><MdMenu />Features</a>
            </nav>
        </div>
    </header>
);

export default SiteHeader;
