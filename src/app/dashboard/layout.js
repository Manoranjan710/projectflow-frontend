'use client';
import AuthGuard from '@/components/AuthGuard';
import React from 'react';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
   <AuthGuard>
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex-1 p-4 bg-gray-100'>
                {children}
            </div>
         </div>
   </AuthGuard>
  )
}

export default DashboardLayout