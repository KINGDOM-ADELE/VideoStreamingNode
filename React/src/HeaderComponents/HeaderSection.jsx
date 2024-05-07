import Nav from "./HeaderSection/Nav"
import Logo from "./HeaderSection/logo"
import MenuIcon from "./HeaderSection/MenuIcon"
// import { AppContext } from "../Context/App_Context";
// import { useContext, useEffect, useRef } from "react";

function HeaderSection() {
  // const { SeverPublickey } = useContext(AppContext)
  // let tempSeverPublickey  = useRef( )

  // tempSeverPublickey.current = SeverPublickey
  // useEffect(() => {
  //   tempSeverPublickey.current()
  //   return () => {
  //   };
  // }, [ ]);


  return (
    <div className="w-full fixed bg-slate-900 flex justify-between z-10 text-white px-4 py-2 items-center">
    <Logo />
    <Nav />
    <MenuIcon />
    </div>

  )
}

export default HeaderSection