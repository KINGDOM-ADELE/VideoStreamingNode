// import { useContext } from 'react';
// import { AppContext } from '../../Context/App_Context'; 




// function Logo() {
//     const { scrollToRef, homeRef } = useContext(AppContext)
  

//   return (
//     <div onClick={() => scrollToRef(homeRef)} className="logo">
//           <img src={require('../../assets/zenager_logo.png')}
//             alt="Logo"
//           />
//     </div>
//   )

// //   return (
// //     <div onClick={() => scrollToRef(homeRef)} className="logo">
// //           <img src={require('../../assets/zenager_logo.png').default} // Use .default to access the image URL
// //             alt="Logo"
// //           />
// //     </div>
// //   )
// }

// export default Logo




import { useContext } from 'react';
import { AppContext } from '../../Context/App_Context'; 
import zenagerLogo from '../../assets/kingdom_logo.png';
 // Import the image using ES module syntax


function Logo() {
    const { scrollToRef, homeRef } = useContext(AppContext);
  

  return (
    <div onClick={() => scrollToRef(homeRef)} className="logo">
          <img src={zenagerLogo} // Use the imported image directly
            alt="Logo"
          />
    </div>
  )
}

export default Logo;
