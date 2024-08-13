'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../component/Header"
import Link from "next/link"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"

export default function LogIn () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    const accountLogIn = (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMessage('')

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed In
            router.push('/chat')
        })
        .catch((error) => {
            setErrorMessage(error.message)
            setLoading(false)
        })
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
            <Header title={"Log In"} subtitle={"Log in to continue"} />
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <form onSubmit={accountLogIn} className="space-y-6">
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
                    <button 
                        className={`w-full p-3 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 focus:outline-none ${loading && 'opacity-50 cursor-not-allowed'}`}
                        type="submit"
                        disabled={loading}>
                       {loading ? "Logging In" : "Continue"}     
                    </button>
                </form>
                {errorMessage && <p className="text-red-500 font-medium mt-4">{errorMessage}</p>}
                <div className="mt-4 text-center">
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Don&apos;t have an account? Sign up.
                    </Link>
                </div>
            </div>
        </main>
    )
}
