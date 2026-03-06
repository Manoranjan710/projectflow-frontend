'use client';
import AuthGuard from '@/components/AuthGuard'
import React from 'react'

const page = () => {
  return (
    <AuthGuard>
          <div>page</div>
    </AuthGuard>
  )
}

export default page