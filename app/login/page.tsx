"use client"
import { signIn } from 'next-auth/react'

export default function page() {
    return (

        <button onClick={() => signIn("google", { callbackUrl: "/" })}>
            Sign in with Google
        </button>

    )
}