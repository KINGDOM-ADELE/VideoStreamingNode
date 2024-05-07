import { useState, useContext } from 'react';

import { FaTimes } from "react-icons/fa"; 
import { TiThMenu } from "react-icons/ti";
import { AppContext } from '../../Context/App_Context';


function MenuIcon() {
  const [click, setClick] = useState(false)
  const {toggleNavVisibility } = useContext(AppContext)

  
  const handleClick = () => {
    setClick( !click )
    toggleNavVisibility()
  }

  return (
    <div  className="menuIcon sm:hidden" onClick={handleClick}>
            {click ? <FaTimes /> : <TiThMenu />}
    </div>
  )
}

export default MenuIcon