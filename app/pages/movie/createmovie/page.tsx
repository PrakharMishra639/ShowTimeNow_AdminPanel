"use client"
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Movie {
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




const CreateMoviePage = () => {

  const [movie, setMovie] = useState<Movie>({
    title: "",
    description: "",
    portraitImgUrl: "",
    portraitImg: null,
    landscapeImgUrl: "",
    landscapeImg: null,
    rating: 0,
    genre: [],
    duration: 0,
  });

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Science Fiction",
    "Thriller",
    "Other",
  ];

  const handleGenreChange = (genre: string) => {
    if (movie.genre.includes(genre)) {
      setMovie({
        ...movie,
        genre: movie.genre.filter((selectedGenre) => selectedGenre !== genre),
      });
    }
    else {
      setMovie({ ...movie, genre: [...movie.genre, genre] });

    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMovie({ ...movie, [name]: value });
  };

  const uploadImage = async (image: File) => {
    try {
      const formData = new FormData();
      formData.append("myimage", image);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        return data.imageUrl;
      } else {
        console.error("Failed to upload the image.");
        return null;
      }
    }
    catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  const handleCreateMovie = async () => {
    try {
      if (
        movie.title === "" ||
        movie.description === "" ||
        movie.rating === 0 ||
        movie.genre.length === 0 ||
        movie.duration === 0
      ) {
        toast.error("Please fill all the fields", {
         
        });
        return;
      }

      let portraitImgUrl = movie.portraitImgUrl;
      let landscapeImgUrl = movie.landscapeImgUrl;

      if (movie.portraitImg) {
        portraitImgUrl = await uploadImage(movie.portraitImg);
        if (!portraitImgUrl) {
          toast.error("Portrait Image upload failed", {
          
          });
          return;
        }
      }
      if (movie.landscapeImg) {
        landscapeImgUrl = await uploadImage(movie.landscapeImg);
        if (!landscapeImgUrl) {
          toast.error("Landscape Image upload failed", {
          
          });
          return;
        }
      }

      const newMovie = { ...movie, portraitImgUrl, landscapeImgUrl };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/createmovie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMovie),
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Movie creation successful", data);

        toast.success("Movie Created Successfully", {
          
        });
      } else {
        console.error("Movie creation failed", response.statusText);
        toast.error("Movie Creation Failed", {
          
        });
      }
    }
    catch (error) {
      console.error("An error occurred during movie creation", error);
    }
  }

  return (
    <div className="formpage bg-gray-100 min-h-screen flex justify-center items-center flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Create Movie</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <input
       className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="title"
        placeholder="Title"
        value={movie.title}
        onChange={handleInputChange}
      />
      <br />
      <input
        className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="description"
        placeholder="Description"
        value={movie.description}
        onChange={handleInputChange}
      />
      <br />
      <label className="m-2 font-semibold">Portrait Image</label>
      <input
       className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="file"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            setMovie({ ...movie, portraitImg: event.target.files[0] })
          }
        }}
      />
      <br />
      <label className="m-2 font-semibold">Landscape Image</label>
      <input
        className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="file"
        accept="image/*"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            setMovie({ ...movie, landscapeImg: event.target.files[0] })
          }
        }}
      />
      <br />
      <label className="m-2 font-semibold">Rating</label>
      <input
        className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        name="rating"
        placeholder="Rating"
        value={movie.rating}
        onChange={handleInputChange}
      />
      <br />
      <div className="m-2">
        <p className="font-semibold">Select Genres:</p>
        {genres.map((genre) => (
          <label key={genre} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              name="genre"
              checked={movie.genre.includes(genre)}
              onChange={() => handleGenreChange(genre)}
               className="form-checkbox text-blue-600 h-5 w-5"
            />
             <span className="ml-2">{genre}</span>
          </label>
        ))}
      </div>

      <br />

      <label className="m-2 font-semibold">Duration</label>
      <input
        className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        name="duration"
        placeholder="Duration"
        value={movie.duration}
        onChange={handleInputChange}
      />
      <br />

      <button className="w-full p-3 m-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleCreateMovie}>Create Movie</button>
      </div>
    </div>
  )
}

export default CreateMoviePage