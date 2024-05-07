// import { Link, Navigate  } from 'react-router-dom';
import { AppContext } from '../../Context/App_Context';
import { useContext} from 'react';

function Nav() {
  const {isVisibleNav, scrollToRef, homeRef, aboutRef, servicesRef, projectsRef, contactRef } = useContext(AppContext)


  // CSS class name for styling
  const navClassNames = `bg-slate-900 rounded-bl rounded-br p-2 flex absolute right-4 top-14 sm:top-0 sm:right-4 ${isVisibleNav ? 'block' : 'hidden'} sm:flex`;


const navList =  <ul className=" w-40 items-center justify-end sm:flex sm:justify-between sm:items-center sm:w-96">
<li className='NavButtons' onClick={() => scrollToRef(homeRef)}>Home</li>
<li className='NavButtons' onClick={() => scrollToRef(aboutRef)}>About</li>
<li className='NavButtons' onClick={() => scrollToRef(servicesRef)}>Services</li>
<li className='NavButtons' onClick={() => scrollToRef(projectsRef)}>Projects</li>
<li className='NavButtons' onClick={() => scrollToRef(contactRef)}>Contacts</li>
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