import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { FaCircleUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";

export default function Header()
{

    const loggedata = useContext(userContext)
    const navigate = useNavigate();

    function logout()
    {
        localStorage.removeItem("nutrify-user")
        loggedata.setloggedUser(null)
        navigate("/login")

    }
    return(
        <div className="nav-body">
            <ul className="nav-items">
                <li className="username" title="Username">{loggedata.loggedUser.name}<FaCircleUser className="user-icon" /></li>
                <li onClick={logout} className="logout-icon" title="Logout"><TbLogout /></li>
            </ul>
        </div>
    )
}