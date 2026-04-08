import { useState} from "react";
import logo from '../assets/logo.png';
import API from "../services/index";
import {useNavigate} from "react-router-dom";

export default function Navbar({user, setUser}){
    let [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();


    return(
       <nav className="bg-white text-black shadow-md fixed w-full z-50 gap-y-0">
         <div className="max-w-9xl">
            <div className="flex justify-between items-center h-20">
                <div className="image bg-cover h-20">
                    <img src={logo} alt="" className="w-64 h-20 mt-1 object-cover" />
                </div>

                <div className="hidden md:flex justify-start items-center space-x-6 mr-8">
                    <a href="#" className="hover:text-black-400 cursor-pointer" onClick={() => navigate('/home')}>
                       Home 
                    </a>
                     <a href="#" className="hover:text-black-400 cursor-pointer">
                       About
                    </a>
                     <a href="#" className="hover:text-black-400 cursor-pointer" onClick={() => navigate('/service')}>
                       Service
                    </a>
                     <a href="#" className="hover:text-black-400 cursor-pointer">
                       Contact
                    </a>
                    {user ? (
                        <button onClick={() => navigate('/profile')} className=" bg-slate-500 text-white w-6 h-6 px-6 py-6  rounded-full cursor-pointer flex flex-col justify-center items-center text-2xl">{user.username?.charAt(0).toUpperCase() || "U"}</button>
                    ): (
                        <button className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/register')}>login</button>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <i className="fa-solid fa-bars mr-4 text-2xl"></i>
                    </button>
                </div>
            </div>
              {isOpen && ( <div className="md:hidden h-screen pb-5 flex flex-wrap flex-col items-center mx-2">
                 <div className="home cursor-pointer w-2/3 h-10 flex justify-center items-center text-center mt-4 hover:bg-slate-100">
                     <a href="#" className="hover:text-black-400" onClick={() => navigate('/home')}>Home</a>
                 </div>
                 <div className="about cursor-pointer w-2/3 h-10 flex justify-center items-center text-center mt-4  hover:bg-slate-100">
                    <a href="#" className="block hover:text-black-400">About</a>
                 </div>
                 <div className="service cursor-pointer w-2/3 h-10 flex justify-center items-center text-center mt-4 hover:bg-slate-100">
                    <a href="#" className="block hover:text-black-400" onClick={() => navigate('/service')}>Services</a>
                 </div>
                <div className="contact cursor-pointer w-2/3 h-10 flex justify-center items-center text-center mt-4 hover:bg-slate-100">
                     <a href="#" className="block hover:text-black-400 mx-4">Contact</a>
                </div>
                {user ? (
                     <div className="login cursor-pointer w-2/3 h-10 text-center flex justify-center items-center mt-4  hover:bg-slate-100">
                        <a href="#" className="block hover:text-black-400 mx-4" onClick={() => navigate('/profile')}>{user.username}</a>
                     </div>
                ):(
                     <div className="login cursor-pointer w-2/3 h-10 text-center flex justify-center items-center mt-4  hover:bg-slate-100">
                        <a href="#" className="block hover:text-black-400 mx-4" onClick={() => navigate('/register')}>Login</a>
                    </div>
                )}
              </div>
             )}
         </div>
       </nav>
    )
}