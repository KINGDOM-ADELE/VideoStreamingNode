import { useContext, useState } from 'react';
import './RegistrationForm.css'; // Import CSS file for styling
import eyeIcon from './assets/la--eye.svg';
import eyeSlashIcon from './assets/la--eye-slash.svg';
import { BeatLoader } from 'react-spinners';
import { AppContext } from './Context/App_Context';
import Swal from 'sweetalert2';

const RegistrationFormCrypto = () => {
  const { API_base_url, StoreToken, StoreUserObj, encryptData, encryptedEncryptionKeyIvsuccesCriteriaArray } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    password: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, password, gender, country } = formData;
    if (!firstName || !lastName || !email || !phone || !password || !gender || !country) {
      alert('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      let encryptedFormData = await encryptData(JSON.stringify(formData));

      const response = await fetch(`${API_base_url}api/v1/users/signup/crypto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'cryptodetail': encryptedEncryptionKeyIvsuccesCriteriaArray.current
        },
        body: JSON.stringify({data: encryptedFormData})
      });

      setIsLoading(false);

      if (!response.ok) {
        throw new Error('Failed to register');
      }

      const data = await response.json();
      StoreToken(data.token);
      StoreUserObj(data.data);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Registration successful, you have been successfully logged in and will be redirected to your dashboard',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirect the user to another page or perform any other actions after successful registration
    } catch (error) {
      setIsLoading(false);

      console.error('Error registering:', error.message);
      setError('Failed to register. Please try again later.');

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: `${error.message}. Please try again later.`
      });
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Registration Form CRYPTO</h2>
      <form onSubmit={handleFormSubmit} className=' flex flex-col justify-center items-center'>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Middle Name:</label>
          <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select className='gender' name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <div className="password-input flex">
            <input className=' flex-grow'
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Toggle Password Visibility"
              className="password-toggle "
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Country:</label>
          <input 
            type="text" 
            name="country" 
            value={formData.country} 
            onChange={handleInputChange} 
            list="countries"
            required 
          />
          <datalist id="countries">
            <option value="United States" />
            <option value="Canada" />
            <option value="Australia" />
            {/* Add more options as needed */}
          </datalist>
        </div>
        <button type="submit" className="submit-btn">
          {isLoading ? (
            <BeatLoader color='#ffffff' loading={isLoading} size={8} />
          ) : (
            'Register'
          )}
        </button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default RegistrationFormCrypto;
