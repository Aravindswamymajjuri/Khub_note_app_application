import { useEffect, useState } from "react"
import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"
import { CiCircleRemove } from "react-icons/ci";

export default function EditingNote(props)

{

    const loggeddetails=useContext(userContext)


    const [message,setmessage] = useState({
        type:"invisible-msg",
        text:""
    })

    const [editDetails,seteditDetails] = useState({
        userid:loggeddetails.loggedUser.userid,
        date:props.value?.date,
        time:props.value?.time,
        title:props.value?.title,
        content:props.value?.content
    })

    useEffect(()=>{
        seteditDetails({
            title:props.value?.title,
            date:props.value?.date,
            time:props.value?.time,
            content:props.value?.content
        })
    },[props])

    function click(event){
        seteditDetails((prevalue)=>{
            return {...prevalue,[event.target.name]:event.target.value}
        })
    }

    function handleSubmit(event)
    {
        event.preventDefault();
        fetch("http://127.0.0.1:8000/notes/"+ loggeddetails.loggedUser.userid+"/" +props.value?.title,{
            method:"PUT",
            body:JSON.stringify(editDetails),
            headers:
            {
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
                date:props.value?.date,
                time:props.value?.time,
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
        <section>
            {
                editDetails.title!=undefined?(
                <form onSubmit={handleSubmit} >
                    <div className="edit-cont">
                        <div className="border">
                            <div className="close-edit" onClick={()=>{
                                loggeddetails.setnewdetails(false)
                                }}><CiCircleRemove />
                            </div>
                            <h4>Update Note</h4>
                            <div className="edit-title">
                                TITLE
                            </div>
                            <input type="text" placeholder="title" 
                                value={editDetails.title} 
                                name="title" onChange={click}
                                className="edit-title-input" />
                                <div className="edit-content">CONTENT</div>
                                <textarea
                                type="text"
                                placeholder="content"
                                rows={5}
                                value={editDetails.content}
                                name="content"
                                onChange={click}
                                className="edit-content-input"
                            />
                            <button className="btn" >
                                UPDATE
                            </button>
                            <p className={message.type}>{message.text}</p>
                        </div>
                    </div>
                </form>
                ):null
            }
        
        </section>
    
    )
}