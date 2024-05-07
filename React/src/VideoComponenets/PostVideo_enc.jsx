import { useContext, useEffect, useState } from 'react';
import './postVideo.css'; // Import CSS file for styling
import { AppContext } from '../Context/App_Context';
import { useNavigate } from 'react-router-dom';

const PostVideoCrypto = () => {
  // const { API_base_url, isLoggedIn, StoreUserObj, getStoredToken } = useContext(AppContext)
  const { API_base_url, isLoggedIn, getStoredToken, encryptFilesToBuffer, encryptData, encryptedEncryptionKeyIvsuccesCriteriaArray} = useContext(AppContext)
  const navigate = useNavigate();


  useEffect(() => {
    const handleIsLoggedIn = () => {
      console.log('handleIsLoggedIn ran')
      if(isLoggedIn() === false){
        navigate(`/`)
      }
      return(true)
    };
    handleIsLoggedIn()
    return () => {
    };
  }, [ isLoggedIn, navigate ]);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    keywords: '',
  });
  
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (event) => {
  //   const fileList = event.target.files;
  //   const newFiles = Array.from(fileList);
  //   setFiles(newFiles);
  // };


  const handleFileChange = (e) => {
    
    const fileList = e.target.files;
    console.log('fileList',fileList )
    const newFiles = Array.from(fileList);
    const fileTypeValid = newFiles.every(file => file.type.startsWith('video/')); // Check if all files are videos
    if (fileTypeValid) {
      console.log('fileTypeValid',fileTypeValid)
      setFiles(newFiles);
      console.log('newFiles',newFiles )
      console.log('validFile',files )
      setError(''); // Clear any previous error
    } else {
      setFiles([]); // Clear files if invalid
      setError('Please select only video files');
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // handleFileChange()
    const { title, description, category, keywords} = formData;

    // Construct form data
    console.log('validFile',files )

    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    formDataToSend.append('category', category);
    formDataToSend.append('keywords', keywords);
    // formDataToSend.append('data', encryptData(JSON.stringify(formData)));
    // JSON.stringify({encryptedFormData})
    // encryptData(SON.stringify(formData))
    
    
    // Append each file to formDataToSend
    console.log('files.length',files.length )


    let filesArray = []
    if (files.length > 0){ 
      console.log(" files",  files)
      files.forEach((file) => {
        // formDataToSend.append(`files`, encryptFilesToBuffer(file));
        filesArray.push(encryptFilesToBuffer(file));
      });
    }
   
    let formDataToSendObj = {
      data: '',
      files: '',
    }
   
    formDataToSendObj.data = encryptData(JSON.stringify(formData))
    formDataToSendObj.files = JSON.stringify(filesArray)

 

    console.log("formDataToSend", formDataToSend)
    try {
      // Send POST request to your API endpoint
      let URL = `${API_base_url}api/v1/videos/crypto`
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          // Include any necessary authentication headers
          // 'Content-Type': 'application/json',
          // 'Content-Type': 'application/text',
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getStoredToken()}`,
          'cryptodetail': encryptedEncryptionKeyIvsuccesCriteriaArray.current
        },
        // body: formDataToSend,
        body: JSON.stringify({obj: formDataToSendObj})
      });

      if (!response.ok) {
        throw new Error('Failed to post video');
      }

      // Video successfully posted
      console.log('Video posted successfully');
      // You can also redirect the user or display a success message here
    } catch (error) {
      console.error('Error posting video:', error.message);
      setError('Failed to post video. Please try again later.');
    }
  };

  return (
    <div className="video-post-container">
      <h2>Post a Video</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Keywords:</label>
          <input type="text" name="keywords" value={formData.keywords} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Files:</label>
          <input type="file" name="files" accept="video/*"  onChange={handleFileChange} multiple required />
        </div>
        <button type="submit" className="submit-btn">Post Video</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default PostVideoCrypto 