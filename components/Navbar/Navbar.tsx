"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from './logo.png';

const Navbar = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const checkAdminAuthentication = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API+'/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'

            });
            if (response.ok) {
                // Admin is authenticated
                setIsAdminAuthenticated(true);
            } else {
                // Admin is not authenticated
                setIsAdminAuthenticated(false);
               
            }
        }
        catch (error) {
            console.error('An error occurred during admin authentication check', error);
            setIsAdminAuthenticated(false);

        }
    }

    useEffect(() => {
        checkAdminAuthentication();
    }, []);
    return (
    <div className="navbar flex justify-between items-center bg-gradient-to-r from-gray-100 via-white to-gray-100 border-b border-gray-300 shadow-lg p-4">
        <Image src={logo} alt="logo" width={160}  className='logo m-[10px]' />
        <div className="adminLinks flex space-x-4">
        {isAdminAuthenticated ? (
                    <>
                        {/* Show links for authenticated admin */}
                        <Link className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/movie/createmovie'>Add Movie</Link>
                        <Link className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/screen'>Add Screen</Link>
                        <Link className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/schedule'>Add Schedule</Link>
                        <Link className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/movie/addceleb'>Add Celeb</Link>
                    
                    </>
                ) : (
                    <>
                        {/* Show login/signup links for unauthenticated admin */}
                        <Link className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/auth/signin'>Login</Link>
                        <Link  className="px-4 py-2 text-lg font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-800 hover:text-white transition duration-200" href='/pages/auth/signup'>Signup</Link>
                    </>
                )}   
        </div>   
    </div>
  )
}

export default Navbar