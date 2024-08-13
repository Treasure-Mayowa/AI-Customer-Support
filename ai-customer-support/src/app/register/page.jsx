'use client'
import React, { useState, useEffect } from "react"
import Header from "../component/Header"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"

export default function SignUp () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    const accountSetup = (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')
        if (password === confirmPassword) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed Up
                router.push('/')
            })
            .catch((error) => {
                setErrorMessage(error.message)
                setLoading(false)
            })
        } else {
            setErrorMessage("Passwords do not match")
            setLoading(false)
        }

    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/')
          }
        })
        return () => unsubscribe()
      }, [router])

    return (
        <main className="h-screen flex flex-col items-center justify-center">
            <Header title={"Sign Up"} subtitle={"Create an Account"}/>
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <form onSubmit={accountSetup} className="space-y-6">
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-900 text-white focus:border-green-500 focus:outline-none"
                        type="email" required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}/>
                    <input 
                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-900 text-white focus:border-green-500 focus:outline-none"
                        type="password" required
                        placeholder="Password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}/>
                    <input
                        className="w-full p-3 rounded-lg border border-gray-300 bg-gray-900 text-white focus:border-green-500 focus:outline-none"
                        type="password" required
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=> setConfirmPassword(e.target.value)}/>
                    <button 
                        className={`w-full p-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none ${loading && 'opacity-50 cursor-not-allowed'}`}
                        type="submit"
                        disabled={loading}>
                       {loading ? "Signing up" : "Continue"}     
                    </button>
                </form>
                {errorMessage && <p className="text-red-500 font-medium mt-4">{errorMessage}</p>}
                <div className="mt-4 text-center">
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Have an account? Log in here.
                    </Link>
                </div>
            </div>
        </main>
    )
}
