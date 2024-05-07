import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/App_Context';
import { AiFillGithub } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";
import { AiFillPhone } from "react-icons/ai";
import { AiFillMail } from "react-icons/ai";
import { AiFillTwitterCircle } from "react-icons/ai";
import kingdomLogo from '../assets/kingdom_logo.png';

import AOS from 'aos';
import 'aos/dist/aos.css'
const Footer = () => {
  const { contactRef } = useContext(AppContext)

  const [attributeValueL, setAttributeValueL] = useState('fade-down');
  const [attributeValueR, setAttributeValueR] = useState('fade-up');

  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      // Example condition: change attribute value based on window width
      if (window.innerWidth < 600) {
        setAttributeValueL('fade-down');
        setAttributeValueR('fade-up');
      } else {
        setAttributeValueL('fade-right');
        setAttributeValueR('fade-left');
      }
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Call handleResize once when component mounts
    handleResize();

    // Clean up: remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures effect runs only once on mount


  useEffect(()=>{
    AOS.init({
      easing: 'ease-in-quart',
      delay: 0,
      // offset: 200,
      duration: 750
  })},[])



  const { APP_NAME2 } = useContext(AppContext)
  let DATE = new Date()
  let YY = DATE.getFullYear()

  return (
    <section id="contacts" ref={contactRef} className="mypaddingTop bg-slate-900 h-full pt-20  px-4 text-center gap-5 lg:text-start flex flex-wrap justify-around lg:gap-28 items-start text-white">
      <div className=' max-w-[1000px] w-full mx-auto flex flex-wrap justify-around items-center '>
        <div>
        <div className='m-4'>
          <figure data-aos={attributeValueL} className=' max-w-[230px] min-w-[190px] aspect-square rounded-full overflow-hidden bg-slate-950 img_glow'>
            <img src={kingdomLogo} className='w-full aspect-square '   alt="" />
          </figure>
        </div>
      </div>

      <div  data-aos={attributeValueR} className='m-4'>
        <h2 className=' text-fuchsia-500'>SERVICES</h2>
        <ul>
          <li>Web design</li>
          <li>Web development</li>
          <li>Web maintainance</li>
          <li>SEO</li>
          <li>E-commerce</li>
          <li>DataBase management</li>
          <li>Data Analysis</li>
          <li>Project management</li>
        </ul>
      </div>

      <div  data-aos="fade-up"  className=' w-full'>
        <h2 className=' text-fuchsia-500 text-center'>CONTACT</h2>
        <div className=' flex space-x-2 flex-wrap justify-center'>
                    <a href="https://github.com/KINGDOM-ADELE" target='_blank' className=' bg-slate-900 text-fuchsia-600 hover:text-fuchsia-500 rounded-full glow p-2 m-2'>
                      <AiFillGithub className=' text-[52px] h-full' />
                    </a>

                    <a href="https://linkedin.com/in/kingdom-adele" target='_blank' className=' bg-slate-900 text-fuchsia-600 hover:text-fuchsia-500 rounded-full glow p-2 m-2'>
                      <AiFillLinkedin  className=' text-[52px] h-full' />
                    </a>

                    <a href="https://linkedin.com/in/kingdom-adele" target='_blank' className=' bg-slate-900 text-fuchsia-600 hover:text-fuchsia-500 rounded-full glow p-2 m-2'>
                      <AiFillTwitterCircle  className=' text-[52px] h-full' />
                    </a>


                    <a href="tel:+2348068578748" target='_blank' className=' bg-slate-900 text-fuchsia-600 hover:text-fuchsia-500 rounded-full glow p-2 m-2'>
                      <AiFillPhone className=' text-[52px] h-full' />
                    </a>

                    <a href="tel:+2348068578748" target='_blank' className=' bg-slate-900 text-fuchsia-600 hover:text-fuchsia-500 rounded-full glow p-2 m-2'>
                      <AiFillMail className=' text-[52px] h-full' />
                    </a>
                </div>
      </div>
      <div className=' w-full pb-4 text-[20px] flex justify-center'>
      &copy;&nbsp;{APP_NAME2}&nbsp;{YY}
      </div>
      </div>
  
    </section>
  )
}

export default Footer