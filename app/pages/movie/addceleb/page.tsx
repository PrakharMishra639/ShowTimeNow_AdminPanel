"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Celeb {
  celebType: "cast" | "crew";
  celebName: string;
  celebRole: string;
  celebImage: File | null;
}

interface Movie {
  _id: string;
  title: string;
}

const AddCelebToMoviePage = () => {
  const [celeb, setCeleb] = useState<Celeb>({
    celebType: "cast",
    celebName: "",
    celebRole: "",
    celebImage: null,
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const getMovies = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`);
    const data = await res.json();
    setMovies(data.data);
    console.log(data.data);
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCeleb({ ...celeb, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCeleb({ ...celeb, celebImage: event.target.files[0] });
    }
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("myimage", image);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    } else {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleAddCeleb = async () => {
    if (!selectedMovieId || !celeb.celebName || !celeb.celebRole || !celeb.celebImage) {
      toast.error("Please fill all fields and select a movie");
      return;
    }

    const celebImageUrl = await uploadImage(celeb.celebImage);
    if (!celebImageUrl) return;

    const newCeleb = {
      movieId: selectedMovieId,
      celebType: celeb.celebType,
      celebName: celeb.celebName,
      celebRole: celeb.celebRole,
      celebImage: celebImageUrl,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/addcelebtomovie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCeleb),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Celeb added successfully");
        setCeleb({
          celebType: "cast",
          celebName: "",
          celebRole: "",
          celebImage: null,
        });
        setSelectedMovieId("");
      } else {
        toast.error("Failed to add celeb");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  useEffect(() => {
    getMovies()
  }, []);

  return (
    <div className="formpage bg-gray-100 min-h-screen flex justify-center items-center flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Add Cast/Crew to Movie</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <label className="font-semibold">Select Movie</label>
        <select
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
        <label className="font-semibold">Type</label>
        <select
          name="celebType"
          value={celeb.celebType}
          onChange={handleInputChange}
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cast">Cast</option>
          <option value="crew">Crew</option>
        </select>
        <input
          type="text"
          name="celebName"
          placeholder="Celebrity Name"
          value={celeb.celebName}
          onChange={handleInputChange}
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="celebRole"
          placeholder="Role"
          value={celeb.celebRole}
          onChange={handleInputChange}
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="m-2 font-semibold">Celebrity Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-3 m-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full p-3 m-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddCeleb}
        >
          Add Celebrity
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCelebToMoviePage;
