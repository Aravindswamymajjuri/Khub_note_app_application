import { useContext, } from "react"
import { userContext } from "../Contexts/UserContext"
import { Navigate } from "react-router-dom";


export default function Private(props)
{
    const loggedData = useContext(userContext);
    return(

        loggedData.loggedUser!==null?
        <props.Component/>
        :
        <Navigate to="/login"/>
    )
}

        

