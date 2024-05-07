// import { Link as RouterLink, Navigate  } from 'react-router-dom';
import { AppContext } from '../../Context/App_Context';
import { useContext} from 'react';
// import { Link as ScroollLink } from "react-scroll"
import { Link as RouteLink } from "react-router-dom"

function Nav() {
  // const {isVisibleNav, scrollToRef, homeRef, aboutRef, servicesRef, projectsRef, contactRef } = useContext(AppContext)
  const {isVisibleNav } = useContext(AppContext)


  // CSS class name for styling
  const navClassNames = `bg-slate-900 rounded-bl rounded-br p-2 flex absolute right-4 top-14 sm:top-0 sm:right-4 ${isVisibleNav ? 'block' : 'hidden'} sm:flex`;


// const navList =  <ul className=" w-40 items-center justify-end sm:flex sm:justify-between sm:items-center sm:w-96">
//     <li className='NavButtons'><ScroollLink className='w-full flex h-full m-0' spy={true} smooth={true} to="home">Home</ScroollLink></li>
//     <li className='NavButtons'><ScroollLink className='w-full flex h-full m-0' spy={true} smooth={true} to="about">About</ScroollLink></li>
//     <li className='NavButtons'><ScroollLink className='w-full flex h-full m-0' spy={true} smooth={true} to="technologies">Technologies </ScroollLink></li>
//     <li className='NavButtons'><ScroollLink className='w-full flex h-full m-0' spy={true} smooth={true} to="projects">Projects</ScroollLink></li>
//     <li className='NavButtons'><ScroollLink className='w-full flex h-full m-0' spy={true} smooth={true} to="contacts">Contacts</ScroollLink></li>
// </ul>

const navList =  <ul className=" w-40 items-center justify-end sm:flex sm:justify-between sm:items-center sm:w-[500px] mx-5">
    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="home">Home</RouteLink></li>
    {/* <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="about">About</RouteLink></li> */}
    {/* <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="technologies">Technologies </RouteLink></li> */}
    {/* <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="projects">Projects</RouteLink></li> */}
    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="registercrypto">registercrypto</RouteLink></li>
    {/* <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="contacts">Contacts</RouteLink></li> */}
    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="postvideocrypto">postvideocrypto</RouteLink></li>

    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="postvideo">Videos</RouteLink></li>
    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="login">Login</RouteLink></li>
    <li className='NavButtons'><RouteLink className='w-full flex h-full m-0' to="register">Register</RouteLink></li>

</ul>






  return (
  // <nav className=''>
  // <ul className=" bg-red-300 w-28 items-center justify-end hidden sm:flex sm:justify-between sm:items-center sm:w-96">
  //     <li><Link to="/">Home</Link></li>
  //     <li><Link to="/about">About</Link></li>
  //     <li><Link to="/services">Services</Link></li>
  //     <li><Link to="/projects">Projects</Link></li>
  //     <li><Link to="/contacts">Contacts</Link></li>
  //   </ul>
  // </nav>
  
  // <nav className=''>
  //   <ul className=" w-28 items-center justify-end hidden sm:flex sm:justify-between sm:items-center sm:w-96">
  //     <li><Link className='NavButtons' to="#home">Home</Link></li>
  //     <li><Link className='NavButtons'to="#about">About</Link></li>
  //     <li><Link className='NavButtons'to="#services">Services</Link></li>
  //     <li><Link className='NavButtons'to="#projects">Projects</Link></li>
  //     <li><Link className='NavButtons'to="#contacts">Contacts</Link></li>
  //     </ul>
  // </nav>


  // <nav className=' bg-slate-900 rounded-bl rounded-br p-2 flex absolute right-4 top-14  sm:top-0 sm:right-4 sm:flex transition'>
  //   <ul className=" w-40 items-center justify-end sm:flex sm:justify-between sm:items-center sm:w-96">
  //     <li className='NavButtons'><Link className='w-full flex h-full m-0' spy={true} smooth={true} to="#home">Home</Link></li>
  //     <li className='NavButtons'><Link className='w-full flex h-full m-0' spy={true} smooth={true} to="#about">About</Link></li>
  //     <li className='NavButtons'><Link className='w-full flex h-full m-0' spy={true} smooth={true} to="#services">Services</Link></li>
  //     <li className='NavButtons'><Link className='w-full flex h-full m-0' spy={true} smooth={true} to="#projects">Projects</Link></li>
  //     <li className='NavButtons'><Link className='w-full flex h-full m-0' spy={true} smooth={true} to="#contacts">Contacts</Link></li>
  //     </ul>
  // </nav>

//   <nav className=' bg-slate-900 rounded-bl rounded-br p-2 flex absolute right-4 top-14  sm:top-0 sm:right-4 sm:flex'>
//     <ul className=" w-40 items-center justify-end sm:flex sm:justify-between sm:items-center sm:w-96">
//       <li className='NavButtons' onClick={() => scrollToRef(homeRef)}>Home</li>
//       <li className='NavButtons' onClick={() => scrollToRef(aboutRef)}>About</li>
//       <li className='NavButtons' onClick={() => scrollToRef(servicesRef)}>Services</li>
//       <li className='NavButtons' onClick={() => scrollToRef(projectsRef)}>Projects</li>
//       <li className='NavButtons' onClick={() => scrollToRef(contactRef)}>Contacts</li>
//     </ul>
// </nav>



<nav className={ navClassNames }>
    {navList}
</nav>

//   <nav>
//   <ul className=" bg-red-300 w-28 items-center justify-end hidden sm:flex sm:justify-between sm:items-center sm:w-96">
//     <li><a href="Home">Home</a></li>
//     <li><a href="About">About</a></li>
//     <li><a href="Services">Services</a></li>
//     <li><a href="Projects">Projects</a></li>
//     <li><a href="Contacts">Contacts</a></li>
//   </ul>
// </nav>

    // <div>Nav</div>
  )
}

export default Nav