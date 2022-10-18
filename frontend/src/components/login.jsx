
import axios from "axios";
import { useState,useRef } from "react";
import "./login.css";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import Cancel from "@material-ui/icons/Cancel";
export default function Login({setshowLogin,myStorage,setCurrentUser}) {
    const [failure, setFailure] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const user={
            username:usernameRef.current.value,
            password:passwordRef.current.value,
        }

try {
    const res=await axios.post("/users/login",user); 
    console.log(res.data.username)
    myStorage.setItem("user",res.data.username)
    setCurrentUser(res.data.username)
    setFailure(false)
    setshowLogin(false)
} catch (error) {
    setFailure(true)
}

    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <ControlCameraIcon/>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={usernameRef}/>
                <input type="password" placeholder="password" ref={passwordRef}/>
                <button className="loginbtn">Login</button>
               
              {failure &&  <span className="failure">Something went wrong :(</span>}
           </form>
        <Cancel className="loginCancel" onClick={()=>setshowLogin(false)}/>  
        </div>
    )


}