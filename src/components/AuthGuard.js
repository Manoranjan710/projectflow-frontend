import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthGuard = ({ children }) => {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
        }
    }, [])
  return children
}

export default AuthGuard;