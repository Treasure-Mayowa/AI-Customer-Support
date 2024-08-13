'use client'
import { useState, useEffect } from "react"
import SendIcon from '@mui/icons-material/Send'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebase"
import { useRouter } from "next/navigation"
import Header from "../component/Header"
import { context } from "./data"


export default function Chat () {
    const [message, setMessage] = useState('')
    const [messageJSX, setMessageJSX] = useState(
        <div className="bg-green-500 text-white p-4 rounded-lg my-2 self-start">
            <p className="text-sm">Hello! How can I help you?</p>
        </div>
    )
    const [loading, setLoading ] = useState(false)
    const router = useRouter()

    const suggestions = [
        "What are your business hours?",
        "Can you help me with my order?",
        "How do I return a product?"
    ]

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push('/login')
        }
      })
      return () => unsubscribe()
    }, [router])

    const handleSuggestionClick = (suggestion) => {
        setMessage(suggestion)
    }

    const getResponse = async (message) => {
        const apiToken = process.env.NEXT_PUBLIC_LLAMA_API_KEY
        setLoading(true)

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${apiToken}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  "model": "meta-llama/llama-3.1-8b-instruct:free",
                  "messages": [
                    {
                        "role": "user", 
                        "content": `You are the customer support chatbot for an e-commerce website. Here is some contextual information: ${JSON.stringify(context)}. Only reply to prompts related to your role, anything otherwise, respond with "Sorry, I can't help with your request" and restate your role. Reply to this message from a user: ${message}`
                    }
                  ],
                })
            })
            const data = await response.json()
            var output = data.choices[0].message.content
            setLoading(false)
            return output
        } catch(error) { 
            console.log(error.message)
            setLoading(false)
            return error.message
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        const response = await getResponse(message.trim())
        setMessageJSX(
            <>
                {messageJSX}
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg my-2 self-end">
                    {message}
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg my-2 self-start">
                    {response}
                </div>
            </>
        )
        setMessage('')
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center">
            <Header title={"AssistBot"}/>
            <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
                <div className="flex flex-col space-y-4 mb-4 overflow-y-auto max-h-96">
                    {messageJSX}
                </div>
                <form onSubmit={sendMessage} className="flex">
                    <div className="flex-grow">
                        <input 
                            id="input-field" 
                            type="text" required 
                            placeholder="Type your message here" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-black"
                        />
                    </div>
                    <button id="submit-button" type="submit" className="ml-2 p-2 bg-green-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none" disabled={loading}>
                        <SendIcon />
                    </button>
                </form>
                <div className="suggestions mt-4 space-y-2">
                    <p className="text-gray-700">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg transition-colors duration-200"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
