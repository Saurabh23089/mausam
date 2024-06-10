import { useEffect, useState } from 'react';
import '../styles/citydata.css';

const Citydata = ({ city, submit }) => {
  const [d, setd] = useState('');
  const [details, setdetails] = useState({
    temp: '',
    humidity: '',
    windspeed: ''
  });

  const [weekdata, setweekdata] = useState();
  const [error, seterrror] = useState('');

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`);
        if (!response.ok) {
          setdetails(null);
          setweekdata(null);
          seterrror('City not Found');
          return;
        }
        const data = await response.json();
        const cityName = data.city.name;
        const daydata = data.list[0];
        const indices = [0, 6, 14, 22, 30, 38];
        const weekarray = data.list;
        const reducearray = indices.reduce((acc, current) => {
          acc.push(weekarray[current]);
          return acc;
        }, []);
        setweekdata(reducearray);
        setd(data);
        setdetails({
          city: cityName,
          temp: Math.floor(daydata?.main?.temp),
          humidity: daydata?.main.humidity || '',
          windspeed: daydata?.wind?.speed || ''
        });
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    city && fetchData();
  }, [city]);

  const date = new Date();
  const month = date.getMonth() + 1;

  return (
    <>
      {submit && (
        <div className='city-container'>
          {details && (
            <div className='city-header'>
              <h1 className='city-title'>{details?.city}</h1>
              <div className='city-date'>
                <h1>{`${date.getDate()}.`}</h1>
                <h1>{month < 10 ? `0${month}.` : `${month}.`}</h1>
                <h1>{`${date.getFullYear()}`}</h1>
              </div>
            </div>
          )}

          {details && (
            <div className='temperature-container'>
              <div className='temperature'>
                <h1 className='temp'>{details?.temp}<sup className='superscriptone'>°</sup></h1>
              </div>

              <div className="weather-details">
                <div className='weather-item'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wind weather-icon" viewBox="0 0 16 16">
                    <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5" />
                  </svg>
                  <h1 className='weather-text'>{`${details?.windspeed} mph`}</h1>
                </div>
                <div className='humidity'>
                  <h1 className='weather-text'>{`humidity : ${details?.humidity}%`}</h1>
                </div>
              </div>
            </div>
          )}

          {weekdata ? (
            <div className="weekdata-container">
              <div className="weekdata-grid">
                {weekdata.map((data, index) => (
                  <div key={index} className={`weekdata-item ${index === 0 ? 'weekdata-item-active' : ''}`}>
                    <p className='weekdata-day'>{index === 0 ? "Today" : days[new Date(data?.dt_txt.split(" ")[0].toString()).getDay()]}</p>
                    <p className='weekdata-temp'>{data?.main?.temp}<sup className='superscript'>°</sup></p>
                    <p className='weekdata-weather'>{data?.weather[0].main}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <h1 className='error-message'>{error}</h1>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Citydata;
