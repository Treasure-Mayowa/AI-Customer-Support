import React from "react"


export default function Header ({ title, subtitle }) {
    return (
        <div className="mx-auto text-center text-black">
            <h1 className="font-extrabold text-4xl">{title}</h1>
            <p className="text-lg p-3">{subtitle}</p>
        </div>
    )
}