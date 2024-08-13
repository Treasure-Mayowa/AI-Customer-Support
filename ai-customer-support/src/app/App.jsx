"use client"

import React, { useEffect, useState } from "react"
import Navigation from '../app/component/Navigation'
import Header from "./component/Header"
import Link from "next/link"
import { auth } from "./firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function App () {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()

    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            user? setIsLoggedIn(true) : setIsLoggedIn(false)
          })
          return () => unsubscribe()
    }, [])

    useEffect(() => {
        const handleLoggedInClick = () => {
            if (isLoggedIn) {
                router.push('/chat')
            }
        }

        if (isLoggedIn) {
            document.addEventListener('click', handleLoggedInClick)
        }

        return () => {
            if (isLoggedIn) {
                document.removeEventListener('click', handleLoggedInClick)
            }
        }
    }, [isLoggedIn, router])

    return (
        <main>
            {!isLoggedIn? (
                <Navigation />
            ): null}
            <div className={`min-h-screen flex flex-col items-center justify-center ${isLoggedIn? "cursor-pointer":null}`}>
                <Header title={"ASSISTBOT"} subtitle={"By ShopSmart"} />
                {isLoggedIn ? (
                    <div className="text-center">
                        <p className="text-gray-700 mt-4">Click anywhere to navigate to the chat</p>
                    </div>
                ) : (
                    <div className="text-center space-y-4 mt-8">
                        <p className="text-gray-700">Welcome to AssistBot. Please log in or register to continue.</p>
                        <div className="flex space-x-4 justify-center">
                            <Link href="/register">
                                <span className="text-base text-gray-700 hover:text-green-700 transition-colors duration-200">Register</span>
                            </Link>
                            <Link href="/login">
                                <span className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                                    Log In
                                </span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}