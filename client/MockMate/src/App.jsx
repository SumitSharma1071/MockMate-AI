import { useState, useEffect, Children } from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import API from "./services";
import Navbar from "./components/Navbar";
import Service from "./pages/Service";
import DSA from './pages/Practice/DSA';
import Result from "./pages/Result";
import Category from './pages/Category';
import Test from './pages/Test';
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
export default function App(){

  const [user, setUser] = useState(null);
  console.log(user);
  useEffect(() =>{
             API.get('/auth/me')
            .then(res =>{ 
              if(res.data.user){ 
              setUser(res.data.user)
              }
            })
            .catch(() => setUser(null));
    }, []);

  return(
    <>
    <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/home" element={<Home user={user} setUser={setUser}/>} />
        <Route path="/register" element={<Register user={user} setUser={setUser} />} />
        <Route path="/service" element={<Service user={user} setUser={setUser}/>}/>
        <Route path="/dsa" element={<DSA/>}/>
        <Route path="/result" element={<Result/>} />
        <Route path="/category" element={
         <ProtectedRoute user={user}>
            <Category user={user} setUser={setUser}/>
        </ProtectedRoute>
        } />
        <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
        <Route path="/test" element={<Test/>} />
      </Routes>
    </>
  )
};
