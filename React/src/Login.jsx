import { useContext, useEffect, useState } from 'react';
import eyeIcon from './assets/la--eye.svg';
import eyeSlashIcon from './assets/la--eye-slash.svg';
import { BeatLoader } from 'react-spinners';
import './RegistrationForm.css';
import { AppContext } from './Context/App_Context';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { API_base_url, handleAlreadyLoggedIn, StoreToken, StoreUserObj} = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

    ///
    useEffect(() => {
      let path = handleAlreadyLoggedIn()
      path && navigate(`/${path}`)
      return () => {
      };
    }, [ API_base_url, handleAlreadyLoggedIn, navigate]);
    ///

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const validateForm = () => {
    // Perform basic form validation
    const { email, password} = formData;
    if ( !email || !password ) {
      alert('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   
    if (!validateForm()) {
        setIsLoading(false);
        return;
      }

    try {
      console.log('formData', formData)
      let URL = `${API_base_url}api/v1/users/login`
      console.log('URL', URL)
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        // Login successful, handle authentication logic here
        console.log('Login successful');
        data.token && StoreToken(data.token) 
        data.data && StoreUserObj(data.data)
      } else {
        // Login failed, display error message
        setError(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login. Please try again later.');
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div className="password-input flex">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Toggle Password Visibility"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <button type="submit">Login
            {isLoading ? (
                <BeatLoader color='#ffffff' loading={isLoading} size={8} />
            ) : (
                'Register'
            )}
        </button>
        {error && <p>{error}</p>}
      </form>
      <div>
        <button onClick={() => console.log('Forgot Password clicked')}>Forgot Password</button>
        <button onClick={() => console.log('Registration clicked')}>Registration</button>
      </div>
    </div>
  );
};

export default Login;
