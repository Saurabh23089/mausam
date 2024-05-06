import {useState,useEffect} from 'react';
import Citydata from './citiesdata';


const Search = () => {

    const[submit,setsubmit] = useState(true);
    const[city,setcity] = useState('');
    const[value,setvalue] = useState("");

    const handlesubmit = (e) => {
       e.preventDefault();
       setcity(value);
       setsubmit(true);
    }

    const handleinputchange = (e) => {
        setvalue(e.target.value);
    }


    useEffect(() => {
        const fetchLocationData = async () => {
            try {

                // Finding user's IP address
                const response = await fetch('https://api.ipify.org/?format=json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const ipData = await response.json();
                const ipAddress = ipData.ip;

                // Fetching location data using ipapi.co
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
        <div className='flex flex-col items-center w-full h-screen'>
            <form onSubmit={handlesubmit} className='flex items-center justify-center md:w-full w-4/5'>
                <div className="relative flex items-center w-full max-w-md h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden mx-2 mt-4">
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        className="peer h-full outline-none text-sm text-gray-700 pr-2"
                        type="text"
                        id="search"
                        placeholder="Search for a city . . . ."
                        onChange={handleinputchange}
                    />

                </div>
            </form>

            <Citydata city={city} submit={submit} />
        </div>
    );
}

export default Search;
