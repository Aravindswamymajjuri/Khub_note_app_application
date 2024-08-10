import { useState } from "react"
import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"
import { CiCircleRemove } from "react-icons/ci";

export default function DeleteNote(props)

{
    const loggeddetails=useContext(userContext)

    
    const [message,setmessage] = useState({

        type:"invisible-msg",
        text:""

    })
    const [editDetails,seteditDetails] = useState({
        userid:loggeddetails.loggedUser.userid,
        title:props.value?.title,
        content:props.value?.content
    })

    function handleSubmit(event)
    {
        event.preventDefault();
        fetch("https://notes-application-yam2.onrender.com/notes/"+ loggeddetails.loggedUser.userid+"/" +props.value?.title,{
            method:"DELETE",
            body:JSON.stringify(editDetails),
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
            seteditDetails({

                userid:loggeddetails.loggedUser.userid,
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

    function change()
    {

    }
    return(
        <section>
            {
                editDetails.title!=undefined?(
                    <form onSubmit={handleSubmit} >
                        <div className="edit-cont">
                            <div className="border">
                                <div className="close-edit" onClick={()=>{
                                    loggeddetails.setdeletedetails(false)
                                    }}><CiCircleRemove/>
                                </div>
                                <h4>
                                    Delete Note
                                </h4>
                                <div className="edit-title">
                                    TITLE
                                </div>
                                <input type="text" placeholder="title" 
                                    value={editDetails.title} 
                                    name="title"
                                    className="edit-title-input"
                                    onChange={change}
                                />
                                <div className="edit-content">CONTENT</div>
                                <textarea
                                    type="text"
                                    placeholder="content"
                                    rows={5}
                                    value={editDetails.content}
                                    name="content"
                                    className="edit-content-input"
                                    onChange={change}
                                />
                                <button className="btn" >
                                    DELETE
                                </button>
                                <p className={message.type}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    </form>
                ):null
            }
        </section>
    
    )
}
