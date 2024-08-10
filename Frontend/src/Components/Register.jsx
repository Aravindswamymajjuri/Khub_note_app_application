import { useState } from "react"
import { Link } from "react-router-dom"

export default function Register()
{
    const [userDetails, setuserDetails] = useState({
        name: "",
        email: "",
        password: ""
    });
    
    const [message, setmessage] = useState({
        type: "invisible-msg",
        text: ""
    });
    
    function handleInput(event) {
        setuserDetails((preValue) => {
            return { ...preValue, [event.target.name]: event.target.value };
        });
    }
    
    function handleSubmit(event) {
        event.preventDefault();
    
        fetch("https://notes-application-yam2.onrender.com/register", {
            method: "POST",
            body: JSON.stringify(userDetails),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "User registered") {
                setmessage({ type: "success", text: data.message });
            } else {
                setmessage({ type: "error", text: data.message });
            }
    
            setuserDetails({
                name: "",
                email: "",
                password: ""
            });
    
            setTimeout(() => {
                setmessage({ type: "invisible-msg", text: "" });
            }, 5000);
        })
        .catch((err) => {
            console.log(err);
            setmessage({ type: "error", text: "Failed to register user" });
        });
    }
    
    
    return(
        <section className="container">
             
            <form className="register" onSubmit={handleSubmit}> 
                <h1 className="heading">Register Here</h1>
                <input type="text" className="inp" placeholder="Enter a name" name="name" onChange={handleInput}
                value={userDetails.name} required/>
                <input type="email" className="inp" placeholder="Enter a Email" name="email" onChange={handleInput}
                value={userDetails.email} required />
                <input type="password" className="inp" placeholder="Enter a Password" name="password" onChange={handleInput}
                value={userDetails.password} required />

                <button className="btn">Register</button>
                <p className="para">Already Register ?<Link to="/login"> Login Now</Link></p>
                <p className={message.type}> {message.text}</p>
            </form>
        </section>
    )
}
