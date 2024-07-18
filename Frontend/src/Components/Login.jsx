import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { userContext } from "../Contexts/UserContext";
import { useContext } from "react";

export default function Login()
{
    const loggeddata = useContext(userContext);
    // useEffect(()=>{
    //     console.log(loggedIndata)
    // },[])

    const navigate = useNavigate();
    
    const [userCred,setuserCred] = useState({

        email:"",
        password:""

    })
    const [message,setmessage] = useState({
        type:"invisible-msg",
        text:""
    }) 
    function handleInput(event)
    {
        setuserCred((preValue)=>{
            return {...preValue,[event.target.name]:event.target.value}
        })
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        
        fetch("http://127.0.0.1:8000/login",{
            method:"POST",
            body:JSON.stringify(userCred),
            headers:{
                "content-type":"application/json"
            }
        })
        .then((response)=>{
            if(response.status===404){
                setmessage({type:"error",text:"userName or Email doesn't exist"})
            }

            else if(response.status===403){
                setmessage({type:"error",text:"Incorrect password"})
            }
                
            setTimeout(() => {
                setmessage({type:"invisible-msg",text:"Hi"})
            }, 5000);

            return response.json()
            
        })
        .then((data)=>{
            if(data.token!==undefined)
            {
                localStorage.setItem("nutrify-user",JSON.stringify(data));
                loggeddata.setloggedUser(data)

                navigate("/home")
            }   
        })
        .catch((err)=>{
            console.log(err)
        })
        
        
    }

    return(
        <section className="container">
             
            <form className="register" onSubmit={handleSubmit}> 
            <h1 className="heading">Login Here</h1>
               
                <input type="email" className="inp" placeholder="Enter a Email" name="email" required onChange={handleInput}/>
                <input type="password" className="inp" placeholder="Enter a Password" name="password" required onChange={handleInput}/>
                

                <button className="btn">Login</button>
                <p className="para">Don't have a Account ? <Link to="/register">Register Now</Link></p>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>
    )
}