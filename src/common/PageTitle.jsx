import { useEffect } from "react";
import { useLocation } from "react-router-dom"

const PageTitle = ({ title }) => {
 const location = useLocation();
 console.log(location,"location",title)

  useEffect(() => {
    document.title = title;
  }, [title, location.pathname]);

  return null;
};

export default PageTitle;
