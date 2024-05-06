import { useEffect, useState } from 'react';

const Citydata = ({ city, submit }) => {

  const [d, setd] = useState('');
  const [details, setdetails] = useState({
    temp: '',
    humidity: '',
    windspeed: ''
  })

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
          temp: Math.floor(daydata?.main?.temp) || '',
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
        <div className='bg-[#fafafa] w-11/12 mt-12 rounded-md'>

          {/* time and date */}
          {details && (
            <div className='flex justify-between mx-12 mt-8'>
              <h1>{details?.city}</h1>
              <div className='flex'>
                <h1>{`${date.getDate()}.`}</h1>
                <h1>{month < 10 ? `0${month}.` : `${month}.`}</h1>
                <h1>{`${date.getFullYear()}`}</h1>
              </div>
            </div>
          )}


          {/* Temperature Details */}
          {details && (
            <div className='flex flex-row md:flex-row items-center justify-center'>
              <div className='flex flex-col justify-center relative mt-4'>
                <h1 className='text-9xl text-center mt-8 text-[#696969]'>{details?.temp}<sup className='text-8xl text-[#696969]'>°</sup></h1>
              </div>

              <div className="flex flex-col gap-2">
                <div className='flex gap-4 items-center ml-4 mt-16 '>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wind inline-flex h-8 w-8 text-[#696969]" viewBox="0 0 16 16">
                    <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5" />
                  </svg>
                  <h1 className='md:text-xl text-[11px] text-[#696969]'>{`${details?.windspeed} mph`}</h1>

                </div>
                <div className='ml-4'>
                  <h1 className='md:text-xl text-[11px] text-[#696969]'>{`humidity : ${details?.humidity}%`}</h1>
                </div>
              </div>
            </div>
          )}

          {/* Weekdata */}
          {weekdata ? (
            <div className="flex flex-col w-full justify-center items-center">
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 my-12 ">
                {weekdata.map((data, index) => (
                  <div key={index} className={`flex flex-col gap-4 relative w-full px-8 flex justify-center items-center rounded-lg ${index === 0 ? 'border-2 border-[#e8e8e8]' : 'border-none'}`}>
                    <p className='mt-4'>{index === 0 ? "Today" : days[new Date(data?.dt_txt.split(" ")[0].toString()).getDay()]}</p>
                    <p className='text-5xl text-normal'>{data?.main?.temp}<sup className='text-5xl text-[#696969]'>°</sup></p>
                    <p className='mb-8'>{data?.weather[0].main}</p>
                    <i>{data?.list?.weather[0].icon}</i>
                  </div>
                ))}

              </div>
            </div>
          ) : (
            <div>
              {error && (
                <h1 className='text-center text-2xl'>{error}</h1>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );


}

export default Citydata;

