import Link from "next/link"

export default function Navigation () {
    return (
        <nav className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
                <Link href="/register">
                    <span className="text-base text-gray-700 hover:text-green-700 transition-colors duration-200">Register</span>
                </Link>
                <Link href="/login">
                    <span className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                        Log In
                    </span>
                </Link>
            </div>
        </nav>
    )
}
