import {useState} from 'react';
import "./App.css";
import React from 'react';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import "./App.css";
import Face from "./components/Face";

function App() {
    document.body.style.backgroundImage = `url('${process.env.PUBLIC_URL}/static/background.jpg')`;
    const myStorage = window.localStorage;
    const [currentUser,
        setCurrentUser] = useState(myStorage.getItem("user"))
    const [showRegister,
        setshowRegister] = useState(false)
    const [showLogin,
        setshowLogin] = useState(false)

    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null)
    }

    return (
        <div className="App">

            {currentUser
                ? (
                    <button className='button logout' onClick={handleLogout}>Log out</button>
                )
                : (
                    <div className='buttons'>
                        <button className='button login' onClick={() => setshowLogin(true)}>Login</button>
                        <button className='register' onClick={() => setshowRegister(true)}>Register</button>
                    </div>
                )}
            {showRegister && <Register
                onClick={() => {
                setshowLogin(false)
            }}
                setshowRegister={setshowRegister}/>}
            {showLogin && <Login
                onClick={() => {
                setshowRegister(false)
            }}
                setshowLogin={setshowLogin}
                myStorage={myStorage}
                setCurrentUser={setCurrentUser}/>}
            {currentUser && (
                <Face currentUser={currentUser}/>
            )}

        </div>
    );
}

export default App;
