// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// const VideoPlayer = () => {
//   const [videos, setVideos] = useState([]);
//   const [advertisement, setAdvertisement] = useState(null);
//   const [error, setError] = useState(null);
//   const [showAdOverlay, setShowAdOverlay] = useState(false);
//   const [showSkipButton, setShowSkipButton] = useState(false);
//   const videoRef = useRef(null);
//   const adVideoRef = useRef(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const response = await axios.get('/api/videos', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setVideos(response.data);
//       } catch (error) {
//         setError(error.response.data.error);
//       }
//     };

//     const fetchAdvertisement = async () => {
//       try {
//         const response = await axios.get('/api/advertisement', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         setAdvertisement(response.data);
//       } catch (error) {
//         setError(error.response.data.error);
//       }
//     };

//     fetchVideos();
//     fetchAdvertisement();
//   }, []);

//   const handlePause = () => {
//     if (!showAdOverlay) {
//       setShowAdOverlay(true);
//     }
//   };

//   const handlePlay = () => {
//     setShowAdOverlay(false);
//     setShowSkipButton(false);
//   };

//   const handleAdPlay = () => {
//     videoRef.current.pause();
//     setShowSkipButton(true);
//   };

//   const handleSkipAd = () => {
//     adVideoRef.current.pause();
//     setShowAdOverlay(false);
//     setShowSkipButton(false);
//   };

//   const handleAdTimeUpdate = (e) => {
//     if (e.target.currentTime >= 30) {
//       setShowSkipButton(true);
//     }
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h2>Videos</h2>
//       <ul>
//         {videos.map((video) => (
//           <li key={video._id}>
//             <h3>{video.title}</h3>
//             <p>{video.description}</p>
//             <div className="video-container">
//               <video
//                 controls
//                 ref={videoRef}
//                 onPause={handlePause}
//                 onPlay={handlePlay}
//               >
//                 <source src={video.url} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//               {showAdOverlay && (
//                 <div className="ad-overlay">
//                   <video
//                     controls
//                     ref={adVideoRef}
//                     onPlay={handleAdPlay}
//                     onTimeUpdate={handleAdTimeUpdate}
//                   >
//                     <source src={advertisement.url} type="video/mp4" />
//                     Your browser does not support the video tag.
//                   </video>
//                   {showSkipButton && (
//                     <button className="skip-ad-button" onClick={handleSkipAd}>
//                       Skip Ad
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default VideoPlayer;


const VideoPlayer = () => {
  return (
    <div>VideoPlayer</div>
  )
}

export default VideoPlayer