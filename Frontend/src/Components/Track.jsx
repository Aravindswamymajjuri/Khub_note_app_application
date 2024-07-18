import { useState } from "react"
import { useContext } from "react"
import { userContext } from "../Contexts/UserContext"
import Header from "../Headers/Header"

export default function Track()
{
   
    const loggeddetails = useContext(userContext)


    const [foodItem,setfoodItem] = useState([])
    
    const [food,setfood] = useState(null)

    function search(event)
    {
    if(event.target.value.length!==0)
        {
            fetch("http://127.0.0.1:8000/notes/"+ event.target.value,{
                method:"GET",
                headers:{
                    "authorization":"Bearer "+ loggeddetails.loggedUser.token
                }
            })
            .then((response)=>{
                return response.json()
            })
            .then((data)=>{
                console.log(data)
                if(data.message===undefined)
                {
                    setfoodItem(data)
                }
                else
                {
                    setfoodItem([]);
                }
                
            })
            .catch((err)=>{
                console.log(err)
            })  
        }
        else
        {
            setfoodItem([])
        }
        
    }




    return(
       
        <div className="container body">
              <Header/> 
            <input type="search" placeholder="Search a food item" className="search-inp" onChange={search}/>
            {
                foodItem.length!==0?(
                <div className="search-results">
                    {
                        foodItem.map((item)=>{
                            return(
                                <p className="item" onClick={()=>{
                                    setfood(item)
                                }} key={item._id}>{item.title}</p>
                            )
                        })
                    }
                </div>):
                null
            }
            {
                food!==null?(
                    <div className="note-body">
                    <div className="note-title">TITLE</div>
                    <input className="title"value={food.title} />
                    <input className="content" value={food.content}/>
                </div>
                ):null
            }
            

           
        </div>


    )
}