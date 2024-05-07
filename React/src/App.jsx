import { BrowserRouter, Routes, Route } from "react-router-dom";
// import MyMain from "./Layout/MyMain";
import { AppContextProvider } from './Context/App_Context';
import { useState, useEffect, Suspense, useRef, lazy } from "react";
import { BallTriangle } from "react-loader-spinner";

import Header from "./Layout/Header"
import Footer from "./Layout/Footer";
import AesGenerator from "./AesGenerator";
import RSAKeyPairGenerator from "./RsaPairGenerator";
import RegistrationFormCrypto from "./RegistrationForm_enc";
// import RSAKeyPairGeneratorPEM from "./RSAKeyPairGeneratorPEM";

// import PostVideo from "./VideoComponenets/postVideo"
const Login = lazy(() => import('./Login'));
const RegistrationForm = lazy(() => import('./RegistrationForm'));
const VideoPlayer = lazy(() => import('./VideoComponenets/VideoPlayback'));
const PostVideo = lazy(() => import('./VideoComponenets/PostVideo'));
const PostVideoCrypto = lazy(() => import('./VideoComponenets/PostVideo_enc'));
const Contact = lazy(() => import('./MainComponents/Contact'));
const Projects = lazy(() => import('./MainComponents/Projects'));
const Technologies = lazy(() => import('./MainComponents/Technologies'));
const About = lazy(() => import('./MainComponents/About'));
const Home = lazy(() => import('./MainComponents/Home'));



function App() {

  const [loading, setLoading] = useState(false)
  let susLoading = useRef()

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  }, [])

  susLoading.current = 
    <div className=" bg-slate-900 h-[100vh] flex items-center justify-center ">
    <BallTriangle 
    height={100}
    width={100}
    radius={5}
    color="#d946ef"
    ariaLabel="ball triangle loading"
    wrapperClass="{{}}"
    wrapperStyle=''
    visible={true}   
  />
  </div>

// susLoading.current = <div>Loading...</div>

  return (
    <>
    { loading ? 
      <div className=" bg-slate-900 h-[100vh] flex items-center justify-center ">
      <BallTriangle 
      height={100}
      width={100}
      radius={5}
      color="#d946ef"
      ariaLabel="ball triangle loading"
      wrapperClass="{{}}"
      wrapperStyle=''
      visible={true}   
    />
    </div>
  :

    <AppContextProvider >
      <BrowserRouter>
        <Header /> 

        <main className=" min-h-[calc(100vh - 10px] pt-24 " >
        <Suspense  fallback={susLoading.current}>     
          <Routes>
            RegistrationFormCrypto
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/registercrypto" element={<RegistrationFormCrypto />} />
            <Route path="/postvideocrypto" element={<PostVideoCrypto />} />


            <Route path="/login" element={<Login />} />
            
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/postvideo" element={<PostVideo />} />
            <Route path="/video" element={<VideoPlayer />} />
            
            <Route path="/*" element={<Home />} />
          </Routes>
        </Suspense>
        </main>  
        <AesGenerator /> 
        <RSAKeyPairGenerator /> 
        {/* <RSAKeyPairGeneratorPEM />  */}


        <Footer/>
      </BrowserRouter>
    </AppContextProvider >
  }
  </>
  )
}

export default App
