import { useEffect, useState } from "react"
import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"

// components  

import DeleteNote from "./DeleteNote";
import CreateNote from "./CreateNote";
import EditingNote from "./EditingNote";
import Header from "../Headers/Header"

// react-icons 

import { IoIosAddCircle } from "react-icons/io"; 
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";


const NotesComponent = () => {
    const loggeddetails = useContext(userContext);
    const popupinfo = loggeddetails.newdetails;
    const popupdelete = loggeddetails.deletedetails;
    const popupcreate = loggeddetails.createdetails;

    const [contentdetails, setContentDetails] = useState([]);
    const [datas, setDatas] = useState(null);


    const fetchNotes = () => {
        fetch(`https://notes-application-yam2.onrender.com/notes/${loggeddetails.loggedUser.userid}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${loggeddetails.loggedUser.token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === undefined) {
                setContentDetails(data);
            } else {
                setContentDetails([]);
            }
        })
        .catch(err => {
            console.log(err);
        });
    };

    useEffect(() => {
        fetchNotes();
    }, [popupinfo, popupdelete, popupcreate]);

    return (
        <section>
            <Header />
            {contentdetails.length !== 0 ? (
                <div className="read-cont">
                    {contentdetails.map((item) => (
                        <div className="read-item" key={item._id}>
                            <p className="read-title">{item.title}</p>
                            <div className="read-date">
                                Note created on: {item.date} time: {item.time}
                            </div>
                            <p className="read-content">{item.content}</p>
                            <div className="edit-delete">
                                <div className="edit" title="Edit note" onClick={() => {
                                    setDatas(item);
                                    loggeddetails.setnewdetails(true);
                                }}>
                                    <FiEdit />
                                </div>
                                <div className="delete" title="Delete note" onClick={() => {
                                    setDatas(item);
                                    loggeddetails.setdeletedetails(true);
                                }}>
                                    <RiDeleteBin5Line />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : 
            (
                <div className="no-data-message">
                    No notes available. Please add some notes.
                </div>
            )}
            <div title="Add note" className="add" onClick={() => {
                loggeddetails.setcreatedetails(true);
                }}>
                <IoIosAddCircle />
            </div>
            {datas !== null && popupinfo && <EditingNote value={datas} />}
            {datas !== null && popupdelete && <DeleteNote value={datas} />}
            {popupcreate && <CreateNote />}
        </section>
    );
};

export default NotesComponent;








