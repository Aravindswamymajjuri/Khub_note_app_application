import { useState } from "react"
import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"
import { CiCircleRemove } from "react-icons/ci";

export default function CreateNote()
{

    const loggeddetails=useContext(userContext)
    const [UserContent,setUserContent] = useState({
        userid:loggeddetails.loggedUser.userid,
        date:new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
        time:new Date().getHours()+" Hours "+new Date().getMinutes()+" Mins",
        title:"",
        content:""
    })
    const [message,setmessage] = useState({
        type:"invisible-msg",
        text:""
    })
    function handleInput(event){
        setUserContent((prevalue)=>{
            return {...prevalue,[event.target.name]:event.target.value}
        })
    }
    function handleSubmit(event)
    {
        event.preventDefault();
        fetch("http://127.0.0.1:8000/notes/"+ loggeddetails.loggedUser.userid,{

            method:"POST",
            body:JSON.stringify(UserContent),
            headers:{
                "content-type":"application/json",
                "authorization":"bearer "+ loggeddetails.loggedUser.token
            }   
        })
        .then((response)=>{
            return response.json()
        })

        .then((data)=>{
            setmessage({type:"success",text:data.message})
            setUserContent({

                userid:loggeddetails.loggedUser.userid,
                date:new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
                time:new Date().getHours()+" Hours "+new Date().getMinutes()+" Mins",
                title:"",
                content:""
            })
            setTimeout(()=>{
                setmessage({type:"invisible-msg",text:"Hi"})
            },5000);

        })
        .catch((err)=>{
            console.log(err)
        })


    }
    return(
        <section className="create-container">
            <form className="createnote" onSubmit={handleSubmit}>
                <div className="close-create" onClick={() => {
                    loggeddetails.setcreatedetails(false);
                    }}>
                    <CiCircleRemove />
                </div>
                <h1 className="heading">Add Note</h1>
                <label htmlFor="title" className="input-label">Title</label>
                <input
                    type="text"
                    id="title"
                    className="inp"
                    placeholder="Enter the note title"
                    name="title"
                    onChange={handleInput}
                    value={UserContent.title}
                    required
                />
                <label htmlFor="content" className="input-label">Content</label>
                <textarea
                    id="content"
                    className="inp"
                    placeholder="Enter content"
                    name="content"
                    onChange={handleInput}
                    value={UserContent.content}
                    required
                />
                <button className="btn">Add Note</button>
                <p className={message.type}>{message.text}</p>
            </form>
        </section>   
    )
}











