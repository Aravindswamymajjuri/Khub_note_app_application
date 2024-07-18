import { useState } from 'react'
import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './Components/Register'
import Login from './Components/Login'
import NotFound from './Components/404NotFound'
import { userContext } from './Contexts/UserContext'
import Private from './Components/Private'
import Home from './Components/Home'


function App() {
  const [loggedUser,setloggedUser] = useState(JSON.parse(localStorage.getItem("nutrify-user")));
  const [newdetails,setnewdetails] =useState(false)
  const [deletedetails,setdeletedetails] = useState(false)
  const [createdetails,setcreatedetails] = useState(false)


  return (
    <userContext.Provider value={{loggedUser,setloggedUser,newdetails,setnewdetails,deletedetails,setdeletedetails,createdetails,setcreatedetails}}>
      
      <BrowserRouter>
      
        <Routes>
          <Route path='/' element={<Private Component = {Home}/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Private Component = {Home}/>}/>
          <Route path='*' element={<NotFound/>}/>  
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  
  )
}

export default App
