import { useState, useEffect } from 'react';
import Citydata from './citiesdata';
import '../styles/searchbar.css';

const Search = () => {
  const [submit, setsubmit] = useState(true);
  const [city, setcity] = useState('');
  const [value, setvalue] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    setcity(value);
    setsubmit(true);
  }

  const handleinputchange = (e) => {
    setvalue(e.target.value);
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  }

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch('https://api.ipify.org/?format=json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const ipData = await response.json();
        const ipAddress = ipData.ip;
        const locationResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        if (!locationResponse.ok) {
          throw new Error('Location data request failed');
        }
        const locationData = await locationResponse.json();
        const city = locationData.city;
        setcity(city);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocationData();
  }, []);

  return (
    <div className='search-container'>
      <form onSubmit={handlesubmit} className='search-form'>
        <div className="search-input-container">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="search-input"
            type="text"
            id="search"
            placeholder="Search for a city . . . ."
            onChange={handleinputchange}
          />
        </div>
        <button type="button" className="toggle-theme-button" onClick={toggleDarkMode}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className={`bi ${isDarkMode ? "bi-sun-fill" : "bi-brightness-low"}`} viewBox="0 0 16 16">
            <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8m.5-9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m5-5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m-7.779 7.779a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707m7.072 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707M3.757 4.464a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707" />
          </svg>
        </button>
      </form>

      <Citydata city={city} submit={submit} />
    </div>
  );
}

export default Search;
