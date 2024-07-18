import { Link } from "react-router-dom";

export default function NotFound()
{
    return(
        <div className="container" >
        <h1 className="notfound">Page Not Found   <Link to="/register">Register</Link></h1>
        
        </div>
    )
}