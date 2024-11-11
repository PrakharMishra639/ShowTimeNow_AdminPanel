"use client";
import React from 'react';
import { ToastContainer, toast } from "react-toastify";

interface schedule {
  screenId: string,
  movieId: string,
  showTime: string,
  showDate: string
}
interface Screen {
  _id: string;
  name: string;
  location: string;
  seats: any[];
  city: string;
  screenType: string;
}

interface Movie {
  _id: string;
  title: string;
  description: string;
  portraitImgUrl: string;
  portraitImg: File | null;
  landscapeImgUrl: string;
  landscapeImg: File | null;
  rating: number;
  genre: string[];
  duration: number;
}

const Page = () => {
  const [schedule, setSchedule] = React.useState<schedule>({
    screenId: '',
    movieId: '',
    showTime: '',
    showDate: ''
  });

  const [city, setCity] = React.useState('');
  const [screens, setScreens] = React.useState<Screen[]>([]);
  const [movies, setMovies] = React.useState<Movie[]>([]);

  const getMovies = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`);
    const data = await res.json();
    setMovies(data.data);
    console.log(data.data);
  };

  React.useEffect(() => {
    getMovies();
  }, []);

  const getScreensByCity = async () => {
    if (city === '') return toast.error('Please select a city');
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/screensbycity/${city.toLowerCase()}`);
    const data = await res.json();
    setScreens(data.data);
    console.log(data.data);
  };

  const createSchedule = async () => {
    if (!schedule.screenId || !schedule.movieId || !schedule.showTime || !schedule.showDate) {
      toast.error("Please fill all the fields");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/addmoviescheduletoscreen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(schedule)
    });

    const data = await res.json();
    console.log(data);
    if (data.ok) {
      toast.success("Schedule created successfully");
    } else {
      toast.error("Schedule creation failed");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-5">Movie Screening Scheduler</h1>
      
      <div className="w-full max-w-md flex items-center mb-6">
        <input
          type="text"
          name="city"
          id="city"
          className="p-3 w-full text-lg border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder='Enter city'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white border-none rounded-r-md px-5 py-2.5 text-lg hover:bg-blue-600 transition duration-200"
          onClick={getScreensByCity}
        >
          Search
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Available Screens</h2>
      <div className='flex flex-wrap justify-center gap-5 mb-7'>
        {screens?.map((screen, index) => (
          <div
            className={`bg-white shadow-lg rounded-lg p-5 w-72 transition-all duration-300 ease-in-out text-center cursor-pointer 
              ${schedule.screenId === screen._id ? ' !bg-blue-500 !text-white' : 'bg-gray-100 text-gray-700 hover:bg-red-400  hover:text-white'}
              border border-gray-300`}
            key={index}
            onClick={() => setSchedule({ ...schedule, screenId: screen._id })}
          >
            <h3 className="font-semibold text-lg">{screen.name}</h3>
            <p className="text-sm">{screen.location}</p>
            <p className="text-sm">{screen.city}</p>
            <p className="text-sm">{screen.screenType}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-3">Movies</h2>
      <div className='flex flex-wrap justify-center gap-5 mb-7'>
        {movies?.map((movie, index) => (
          <div
            className={`bg-white shadow-lg rounded-lg p-5 w-72 transition-all duration-300 ease-in-out text-center cursor-pointer 
              ${schedule.movieId === movie._id ? ' selected !bg-blue-500 !text-white ' : 'bg-gray-100 text-gray-700  un-selected hover:bg-red-400 hover:text-white'}
              border border-gray-300`}
            key={index}
            onClick={() => setSchedule({ ...schedule, movieId: movie._id })}
          >
            <h3 className="font-semibold text-lg">{movie.title}</h3>
            <p className="text-sm">{movie.description}</p>
            <p className="text-sm">Rating: {movie.rating}</p>
            <p className="text-sm">Genre: {movie.genre.join(', ')}</p>
            <p className="text-sm">Duration: {movie.duration} min</p>
          </div>
        ))}
      </div>

      <div className="flex items-center mb-6">
        <input
          type="time"
          name="showTime"
          id="showTime"
          className="p-3 text-lg border border-gray-300 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSchedule({ ...schedule, showTime: e.target.value })}
        />
        <input
          type="date"
          name="showDate"
          id="showDate"
          className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSchedule({ ...schedule, showDate: e.target.value })}
        />
      </div>

      <button
        className="bg-blue-500 text-white border-none rounded-md px-6 py-2 text-lg hover:bg-blue-600 transition duration-200"
        onClick={ () =>{createSchedule()}}
      >
        Save Schedule
      </button>
    </div>
  );
};

export default Page;
