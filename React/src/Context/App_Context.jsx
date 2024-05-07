import { createContext, useState, useRef } from 'react'
import PropTypes from 'prop-types';
import { Buffer } from 'buffer';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';


export const AppContext  = createContext(null);

export const AppContextProvider = (props) => {
  const { children } = props; // Destructure children from props

  // const location = useLocation();
  // let API_base_url
  // let testProd = false
  // if(process.env.NODE_ENV === "production"){}

  // or

  let API_base_url
  let testProd = false // determines which base url that will be used on build with local testing
  if(import.meta.env.NODE_ENV === "production"  && import.meta.env.testProd === true ){
    console.log('testProd', testProd)
    API_base_url = "https://kingdom.onrender.com/"
    console.log('API_base_url', API_base_url)
  }
  else if (import.meta.env.NODE_ENV === 'production' && import.meta.env.testProd === false){
    API_base_url = "http://localhost:7980/"
    console.log('API_base_url', API_base_url)
  }
  else if (import.meta.env.No  === 'production'){
    API_base_url = "https://kingdom.onrender.com/"
    console.log('API_base_url', API_base_url)
  }
  else{
    API_base_url = "http://localhost:7980/"
    console.log('API_base_url', API_base_url)
  }

  const APP_NAME = 'AD_INTEGRATED_VIDEO_PLAYBACK'
  const APP_NAME2 = `AD_INTEGRATED_VIDEO_PLAYBACK`

  const homeRef = useRef('home');
  const aboutRef = useRef('about');
  const technologiesRef = useRef('technologies');
  const projectsRef = useRef('projects');
  const contactRef = useRef('contact');

  const serverPublicKey = useRef('');
  const succesCriteria = useRef('');
  const iv = useRef('');
  const filekey = useRef('');
  const encryptionKey = useRef('');
  const filekeyIV = useRef('');
  const encryptedEncryptionKeyIvsuccesCriteriaArray = useRef('');

  // const scrollToRef = (ref) => {
  //   if (ref.current) {
  //     const element = document.getElementById(ref.current);
  //     if (element) {
  //       element.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       });
  //     }
  //   }
  // };

  // let PublicKey = "mypublic key"

  //// SYMMETRIC ENCRYPTION STARTS ////

  // Function to generate a random string of given length
  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  };
  

  const generateEncryptionKeyAndIV = async () => {
    // Generate random encryption key and IV
    encryptionKey.current = generateRandomString(64); // 256-bit key
    iv.current = generateRandomString(16); // 128-bit IV

  };
  generateEncryptionKeyAndIV()


  
  // Function to read Blob as text
  const readBlobAsText = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  };
  
  // Function to encrypt a file
  const encryptFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const encryptedData = encryptData(reader.result, encryptionKey.current, filekeyIV.current)
        resolve(encryptedData);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
  
  // Function to decrypt a file
  const decryptFile = (encryptedData, encryptionKey, iv) => {
    try {
      const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedWordArray }, encryptionKey, { iv: iv });
      const decryptedBuffer = Buffer.from(decrypted.toString(CryptoJS.enc.Latin1), 'latin1');
      return decryptedBuffer;
    } catch (error) {
      console.error('Error decrypting file:', error);
      throw error;
    }
  };

  // Function to encrypt files to buffer asynchronously
  const encryptFilesToBuffer = async (file, encryptionKey, iv) => {
    try {
      const encryptedData = await encryptFile(file, encryptionKey, iv);
      return new Blob([encryptedData], { type: 'application/octet-stream' });
    } catch (error) {
      console.error('Error encrypting files to buffer:', error);
      throw error;
    }
  };
  
  // Function to decrypt a buffer
  // const decryptFileFromBuffer = async (encryptedBuffer, encryptionKey, iv) => {
  const decryptFileFromBuffer = async (encryptedBuffer) => {
    try {
      const encryptedData = await readBlobAsText(encryptedBuffer);
      const decryptedText = decryptFile(encryptedData, encryptionKey.current, filekeyIV.current)
      return decryptedText;
    } catch (error) {
      console.error('Error decrypting buffer:', error);
      throw error;
    }
  };

  
  // Function to encrypt data
  const encryptData = (plainText, encryptionKey, iv) => {
    try {
      const arrayData = JSON.stringify(plainText); // Modified this line
      const encrypted = CryptoJS.AES.encrypt(arrayData, encryptionKey, { iv: iv }).toString();
      return encrypted;
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  };
  
  // Function to decrypt data
  const decryptData = (encryptedText, encryptionKey, iv) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey, { iv: iv }).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  };
  
  


  //// SYMMETRIC ENCRYPTION ENDS ////

  //// SERVER PUBLIV KEY STARTS ////
  const encryptWithRSA = async (publicKey, data) => {
      try {
          const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
          const encryptedData = publicKeyObj.encrypt(data, 'RSA-OAEP', {
              md: forge.md.sha256.create(),
              mgf1: {
                  md: forge.md.sha1.create()
              }
          });
          encryptedEncryptionKeyIvsuccesCriteriaArray.current = forge.util.encode64(encryptedData)
          console.log('encryptedEncryptionKeyIvsuccesCriteriaArray.current',
                encryptedEncryptionKeyIvsuccesCriteriaArray.current)
          return 1
          // return forge.util.encode64(encryptedData);
      } catch (error) {
          console.error('Encryption failed:', error);
          throw error;
      }
  };



  const SeverPublickey = async () => {
    let tries = 0
    let success = 0
    let errormessage = ''
      const getLatestPublickey = async () => {
      tries += 1
      try {
        // Send POST request to your API endpoint
        let URL = `${API_base_url}api/v1/crypto/getpublickey`
        const response = await fetch(URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to post video');
        }
        const data = await response.json();
        if(data.status === 'success'){
          console.log('publickeyArray')
          console.log(data.data)
          // [ publicKey, succesCriteria]
          serverPublicKey.current = data.data[0];
          succesCriteria.current = data.data[1];

          console.log('serverPublicKey', data.data[0])
          console.log('succesCriteria', data.data[1])
          success += 1
          let encData = JSON.stringify([succesCriteria.current, encryptionKey.current, iv.current])
          // let encData = `${succesCriteria.current}, encryptionKey.current, iv.current`
          encryptWithRSA(data.data[0], encData)
        }
      } catch (error) {
        console.error('Possible network:', error.message);
        // setError('Failed to post video. Please try again later.');
        errormessage = "Connection failed, possible network issue, please check your connection and try again"
      }
    };
    while(tries < 3 && success < 1){
      await getLatestPublickey () // allows 5 tries to send email before proceeding
    }
    console.log( `proceeding after attempts: ${tries} and success: ${success}`)
    if (success < 1){
      Swal.fire({
        icon: 'error',
        title: 'Extra secured connection failed',
        // text: `An error occurred during registration. Please try again later.`,
        text: `${errormessage}.`
      });
    }
  }
  SeverPublickey()


    const getEncryptedHeader = async () => {
      encryptedEncryptionKeyIvsuccesCriteriaArray.current
    }

    const getSuccesCriteria = async () => {
      return succesCriteria.current
    }
  //// SERVER PUBLIV KEY ENDS ////


  // export default encryptWithPublicKey;
  

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
  
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // Use 12-hour format (AM/PM)
    };
  
    return date.toLocaleString(undefined, options);
  }

  const logout = () => { 
    localStorage.removeItem(`${API_base_url}token`)
    localStorage.removeItem(`${API_base_url}User.serialized`)
    console.log('logged out')
 }


  const StoreToken = (token) => { 
    localStorage.setItem(`${API_base_url}token`, token)
   return(token)
 }

 const StoreUserObj = (object) => {  
    filekey.current = object.filekey.key
    filekeyIV.current = object.filekey.iv
    localStorage.setItem(`${API_base_url}User.serialized`, JSON.stringify(object))
   return(object)
 }

  const getStoredToken = () => { 
     const token = localStorage.getItem(`${API_base_url}token`) 
    return(token)
  }

  const getStoredUserObj = () => {   
    const userObj = JSON.parse(localStorage.getItem(`${API_base_url}User.serialized`)) 
    return(userObj)
  }


  const userRole = () => {   
    const userObj = JSON.parse(localStorage.getItem(`${API_base_url}User.serialized`)) 
    return(userObj.role )
  }
  

  const handleAlreadyLoggedIn = () => {  
    const token = getStoredToken()
    const userObj = getStoredUserObj()
    filekey.current = userObj.filekey.filekey
    filekeyIV.current = userObj.filekey.iv
    
    
    if(token === undefined || userObj === undefined || !token || !userObj ){ logout() }
    else{ 
      let path = './';

      if (userObj.role.includes('user')) {
          path = 'User';
      }
      
      return path;
      
   } }


   const isLoggedIn = () => {   
    const token = getStoredToken()
    const userObj = getStoredUserObj()
    let islogedin = false
    if(token === undefined || userObj === undefined || !token || !userObj ){ 
      logout() }
    else{ 
      islogedin = true
    }
    return(islogedin)
  }

  const [isVisibleNav, setIsVisibleNav] = useState(false);
  // Function to toggle visibility
  const toggleNavVisibility = () => {
      setIsVisibleNav(!isVisibleNav);
  };

  const contextValue = { APP_NAME, APP_NAME2, API_base_url, scrollToRef, homeRef, aboutRef, technologiesRef, projectsRef, contactRef, isVisibleNav, toggleNavVisibility,
  logout, StoreToken, StoreUserObj, getStoredToken, getStoredUserObj, userRole, formatTimestamp, handleAlreadyLoggedIn, isLoggedIn,  getEncryptedHeader, 
  getSuccesCriteria, encryptedEncryptionKeyIvsuccesCriteriaArray, encryptFilesToBuffer, encryptData , decryptFileFromBuffer, decryptData}

  return (
    <AppContext.Provider value={ contextValue } >
        { children }
    </AppContext.Provider> 
  )
}

// PropTypes validation for AppContextProvider props
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate children prop
};