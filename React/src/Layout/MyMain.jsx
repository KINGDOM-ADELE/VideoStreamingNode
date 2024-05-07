import { Route, Routes } from "react-router-dom"

import Home from "../MainComponents/Home"
import About from "../MainComponents/About"
import Contact from "../MainComponents/Contact"
import Projects from "../MainComponents/Projects"
import Technologies from "../MainComponents/Technologies"
import Login from "../Login"
import RegistrationForm from "../RegistrationForm"

const MyMain = () => {
  return (

    <div className=" bg-slate-600 min-h-svh">
      <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        
          <Route path="/*" element={<Home />} />
      </Routes> 
    </div>

  )
}

export default MyMain