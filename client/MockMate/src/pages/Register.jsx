import {useState, useEffect} from 'react';
import API from '../services/index';
import { useNavigate, useLocation } from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import Btn from '../components/Btn';
import Inp from '../components/Inp';
import Check from '../components/Check';
import { container, letter, formVariant } from '../services/Register';
import '../css/style.css';

 const welcomeText = "Welcome";
 const nameText = "To MockMate AI";

export default function Register({user, setUser}) {

    const [isLogin, setIsLogin] = useState(false); // false = Signup, true = Login
    const [formData, setFormData] = useState({
        firstname : "",
        lastname : "",
        username : "",
        password : "",
        email : ""
    });

    const [response, setResponse] = useState({
      message : "",
      type : "",
      show : false
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || {pathname : '/'};
    useEffect(() =>{
       if(response.show){
         const timer = setTimeout(() =>{
          setResponse({message : "", type : "", show : false});
         }, 2000);

         return () => clearTimeout(timer);
       }
    }, [response]);

    let handleChange = (e) =>{
       setFormData((currData) =>{
            return {...currData, [e.target.name] : e.target.value};
       });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            const res = await API.post('/auth/register', formData);
           setResponse({
              message : res.data.message,
              type : "success",
              show : true
           });
            setFormData({
                firstname : "",
                lastname : "",
                username : "",
                password : "",
                email : ""
            });

            setUser(res.data.user)

        }catch(err){
           setResponse({
            message : err.response?.data?.message || "Signup Failed",
            type : "error",
            show : true
           });
        }
    };

    const handleLogin = async (e) =>{
      e.preventDefault();
      try{
        const res = await API.post('/auth/login', {
            username : formData.username,
            password : formData.password
        });
         setResponse({
            message : res.data.message,
            type : "success",
            show : true
         });

         setUser(res.data.user);
         navigate(from.pathname, {replace : true, state : from.state});
         
      }catch(err){
        setResponse({
           message : "Something Went Worng !",
           type : "error",
           show : true
        });
      }
    };

  return (
    <>
      <AnimatePresence>
        {response.show && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-10 left-[42%] transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50
              ${response.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {response.message}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
            initial={{ opacity: 0, y: 80 }}            // start thoda aur niche se
            animate={{ opacity: 1, y: 0 }}             // end position
            transition={{
                type: "spring",                          // spring gives bounce effect
                stiffness: 120,                          // tightness of spring
                damping: 15,                             
                mass: 1.5,
                delay: 0.2,                              // delay before animation starts
            }}
        >
      <div className="flex flex-col justify-center items-center md:h-screen w-full pt-24 md:pt-10 px-4 md:px-0 md:my-0">
        <div className="flex flex-col md:flex-row justify-center items-center w-full md:w-5/6 h-3/4 bg-[url('/src/assets/bg.jpg')] bg-cover rounded-2xl drop-shadow-md">
          
          {/* Left Text Section */}
          <div className="flex flex-col justify-center items-center w-full md:w-3/5 p-6 md:p-10 text-center md:text-left">
            <motion.h1
                className="text-6xl sm:text-7xl font-styles mb-4"
                variants={container}
                custom={0}
                initial="hidden"
                animate="visible"
            >
                {welcomeText.split("").map((char, index) => (
                <motion.span key={index} variants={letter}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
                ))}
            </motion.h1>

            <motion.h2
                    className="text-3xl sm:text-3xl md:text-4xl fonts-style"
                    variants={container}
                    custom={1}
                    initial="hidden"
                    animate="visible"
            >
                    {nameText.split("").map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                    ))}
            </motion.h2>
          </div>

          {/* Form Section */}
          <AnimatePresence mode='wait'>
          {isLogin ? ( 
            <motion.div
            className="form w-full md:w-2/5 h-auto md:h-full flex flex-col justify-center items-center bg-white bg-opacity-80 p-6 md:p-10 rounded-r-xl md:rounded-none overflow-hidden"
            key='login'
            variants={formVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            >
            <h1 className='text-2xl sm:text-3xl md:text-4xl text-black mb-6'>Login Here</h1>
            
            <form className='flex flex-col justify-center items-center w-full' noValidate onSubmit={isLogin ? handleLogin : handleSubmit}>
              {/* Username + Password */}
              <div className="flex flex-col w-full justify-center items-center gap-4 mb-4">
                <Inp 
                    label={'username'} 
                    type={"text"} 
                    name={"username"}
                    value={formData.username}
                    onchange={handleChange}
                    required={'required'} 
                    width={'100%'} 
                    color={'success'} 
                />
                <Inp 
                    label={'Password'} 
                    type={"password"} 
                    name={"password"}
                    value={formData.password}
                    onchange={handleChange}
                    required={'required'} 
                    width={'100%'} 
                    color={'success'} 
                />
              </div>
              {/* Buttons */}
              <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-4 mt-4">
                <Btn fnc='login' color="success" variant="contained" width='full' type='submit' />
                <Btn fnc={!isLogin ? "login" : "Sign Up"} variant="contained" width='full' type='button' onClick={() => setIsLogin(false)} />
              </div>

            </form>
          </motion.div>
          ) : (
           <motion.div
            className="form w-full md:w-2/5 h-auto md:h-full flex flex-col justify-center items-center bg-white bg-opacity-80 p-6 md:p-10 rounded-r-xl md:rounded-none"
            key='signup'
            variants={formVariant}
            initial="hidden"
            animate="visible"
            exit="hidden"
            >
            <h1 className='text-2xl sm:text-3xl md:text-4xl text-black mb-6'>SignUp Here</h1>
            
            <form className='flex flex-col justify-center items-center w-full' noValidate onSubmit={isLogin ? handleLogin : handleSubmit}>
              
              {/* Firstname + Lastname */}
              <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mb-4">
                <Inp 
                    label={'firstname'} 
                    type={"text"}  
                    name={"firstname"}
                    value={formData.firstname}
                    onchange={handleChange}
                    required={"required"} 
                    width={'100%'} 
                    color={'success'} 
                />
                <Inp 
                    label={'lastname'} 
                    type={"text"} 
                    name={"lastname"}
                    value={formData.lastname}
                    onchange={handleChange}
                    required={"required"} 
                    width={'100%'} 
                    color={'success'}
                />
              </div>

              {/* Username + Password */}
              <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mb-4">
                <Inp 
                    label={'username'} 
                    type={"text"} 
                    name={"username"}
                    value={formData.username}
                    onchange={handleChange}
                    required={'required'} 
                    width={'100%'} 
                    color={'success'} 
                />
                <Inp 
                    label={'Password'} 
                    type={"password"} 
                    name={"password"}
                    value={formData.password}
                    onchange={handleChange}
                    required={'required'} 
                    width={'100%'} 
                    color={'success'} 
                />
              </div>

              {/* Email */}
              <div className="w-full mb-4">
                <Inp 
                    label={'email'} 
                    type={"email"}
                    name={"email"}
                    value={formData.email}
                    onchange={handleChange}
                    required={'required'} 
                    width={'100%'} 
                    maxWidth={"100%"} 
                    color={'success'} 
                />
              </div>

              {/* Checkbox */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-4 text-sm text-black">
                <Check/>
                <p className="mt-2 sm:mt-0">Agreed with <a href="#" className="text-blue-600 underline">Term</a> & <a href="#" className="text-blue-600 underline">Condition</a></p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 mt-4">
                <Btn fnc='Sign Up' color="success" variant="contained" width='full' type='submit' />
                <Btn fnc='Login' variant="contained" width='full' type='button' onClick={() => setIsLogin(true)} />
              </div>

            </form>
          </motion.div>
    )}
    </AnimatePresence>

        </div>
      </div>
      </motion.div>
    </>
  );
}

