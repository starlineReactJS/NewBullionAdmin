import { Link } from "react-router-dom";
import notFoundImg from "../../assets/image/404.png";
import "../../assets/css/notfound.css";

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found__content">
                <img
                    src={notFoundImg}
                    alt="404 Page Not Found"
                    className="not-found__image"
                />
                <h1 className="not-found__title">Oops! Page Not Found</h1>
                <p className="not-found__text">
                    We can't seem to find the page you're looking for.
                </p>
                <Link to="/login" className="not-found__btn">
                    Back to login
                </Link>
            </div>
        </div>
    );
};

export default NotFound;