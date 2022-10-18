import axios from "axios";
import { useRef, useEffect, useState} from "react";
import "./face.css";
import Switch from "react-switch";
import {OndemandVideo, Filter} from "@material-ui/icons";
export default function Face({currentUser}) {
    const videoRef = useRef(null);
    const [processed_Image,setProcessed_Image] = useState("");
    const [checked,setChecked] = useState(false);
    const handleToggle = nextChecked => {
        setChecked(nextChecked);
      console.log(checked)
        if(!checked){
          setInterval(() => {
            handleVideo();
          },700);
         
        }
       
    };
    const handleSubmit = async(img_src, width, height) => {
      if(img_src&&width&&height&&currentUser){
        if (img_src) {
            const image_src = {
                image_link: img_src,
                username: currentUser,
                width: width,
                height: height
            };
            try {
                const res = await axios.post("/image/face", image_src);
                let {image_data} = res.data;
                setProcessed_Image(image_data);
            } catch (error) {}
        }
      }
    }

    const handleChange = async(e) => {
        e.preventDefault();
        try {
            if (e.target.files.length > 0) {
                var src = URL.createObjectURL(e.target.files[0]);
                var preview = document.getElementById("file-ip-1-preview");
                preview.src = src;
                preview.style.display = "block";
                let img = document.getElementById("file-ip-1-preview");
                var reader = new FileReader();
                var baseString;
                img.onload = async function () {
                    reader.onloadend = async function () {
                        baseString = reader.result;
                        await handleSubmit(baseString, img.width, img.height);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            }
        } catch (error) {}
    }

    const handleVideo = ()=>{
      if(!checked){
        const video = document.getElementById("video");
        let canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 460;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL('image/jpeg');
        handleSubmit(dataURI,canvas.width,canvas.height)
        canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)
      }
    }




    useEffect(() => {
     if(!checked){
      return;
     }
      const getUserMedia = async () => {
        let video = document.getElementById("video");
        try {
         navigator.getUserMedia(
          {video:{}},
          stream=>video.srcObject = stream,
          err=>console.error(err)
         )
       
       
        } catch (err) {
          console.log(err);
        }
      };
      getUserMedia();
      
    }, [checked]);







    return (
       <> 
       <Switch
        checked={checked}
        onChange={handleToggle}
        handleDiameter={28}
        offColor="#08f"
        onColor="#08f"
        offHandleColor="#08f"
        onHandleColor="#08f"
        height={40}
        width={70}
        borderRadius={6}
        activeBoxShadow="0px 0px 1px 2px #fffc35"
        uncheckedIcon={<div style = {{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontSize: 15, color: "orange", paddingRight: 2 }} > </div>}
        checkedIcon={<svg viewBox = "0 0 10 10" height = "100%" width = "100%" fill = "yellow" > <circle r={3} cx={5} cy={5}/> </svg>}
        uncheckedHandleIcon={<div style = {{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontSize: 20 }} > <Filter/> </div>}
        checkedHandleIcon={<div style = {{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "red", fontSize: 18 }} > <OndemandVideo/> </div>}
        className="react-switch"
        id="small-radius-switch"/> <div className = "faceContainer" > <div></div>
        <div className = "center">
    { 
          !checked && <> <div className = "form-input"> <div className="preview">

            <img id="file-ip-1-preview" alt="Select img to be processed!" src=""/>

            <label htmlFor="file-ip-1">Upload</label>
            <input
                type="file"
                id="file-ip-1"
                accept=" image/jpeg,image/jpg"
                onChange={(e) => {
                handleChange(e)
            }}
            />
        </div> </div>
      </>
    } 
    {checked&& <>
    
    <div>
      <video id="video" width={900} height={460} ref={videoRef} autoPlay muted>

      </video>

    </div>
    
    
    
    
    
    
    
    
    </>}
    
    
    
    
    </div> 
<div className="result">

<div style={{backgroundImage: `url('${process.env.PUBLIC_URL}/static/frame_background.jpg ')`}}id="frame"className="frame">
 <img src = {processed_Image} alt = "" onError= {(e)=>{
  e.target.onerror = null;
  e.target.src =`${process.env.PUBLIC_URL}/static/frame_background.jpg`}} /> 
    </div> </div>
        </div >
        </>
        )
}
