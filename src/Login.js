import React, { useEffect, useState } from 'react'
import { auth } from './firebase';
import ReactLoading from 'react-loading';


function Login({setUser}) {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("")
    const [loading, setloading] = useState(false);

    const reg=(e)=>{
        e.preventDefault();
        setloading(true);
        console.log(email);
        console.log(password);
        auth.signInWithEmailAndPassword(email,password)
        .then((userAuth)=>{
            setUser({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: userAuth.user.displayName,
                photoUrl: userAuth.user.photoURL,
            })
        })
        .catch(e=>{
            console.log(e);
        })
        // setloading(false);
    }    

    return (
      
        <div className="flex flex-col w-3/12 mx-auto my-20 gap-y-3  ">
              {loading ? <ReactLoading type={'balls'} color={"black"} height={100} width={100} className="mx-auto my-20" />:(
                  <div>
            <img className="mx-auto" width="100px" src="http://www.clker.com/cliparts/5/4/h/I/F/A/admin-md.png"></img>

            
                <form className="flex flex-col gap-y-2">
                    <input onChange={e => setemail(e.target.value)} className="py-3 px-2 rounded-lg border-2 border-gray-400 outline-none" placeholder="Email"></input>
                    <input type="password" onChange={e => setpassword(e.target.value)} className="py-3 px-2 rounded-lg border-2 border-gray-400 outline-none" placeholder="Password"></input>
                    <button onClick={reg} className="py-3 px-2 rounded-lg border-2 bg-blue-400 outline-none">Sign In</button>
                    
                </form>
            </div>
            )}
        </div>
    )
}

export default Login
