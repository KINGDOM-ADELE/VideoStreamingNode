// import { Route, Routes } from "react-router-dom"

import Home from "../MainComponents/Homen"
// import About from "../MainComponents/About"
// import Contact from "../MainComponents/Contact"
// import Projects from "../MainComponents/Projects"
// import Services from "../MainComponents/Services"

const MyMain = () => {
  return (
    // <div className=" bg-slate-600 min-h-svh">
    //   <Routes>
    //       <Route path="/services" element={<Services />} />
    //       <Route path="/projects" element={<Projects />} />
    //       <Route path="/contact" element={<Contact />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/*" element={<Home />} />
    //   </Routes> 
    // </div>

    <div className=" bg-slate-600 min-h-svh">
      <Home />
      {/* <About /> */}
      {/* <Services /> */}
      {/* <Projects /> */}
      {/* <Contact /> */}
    </div>

    // <h1  className=" bg-slate-600 min-h-svh ">MyMain</h1>
  )
}

export default MyMain