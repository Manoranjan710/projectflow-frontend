'use client';
import AuthGuard from '@/components/AuthGuard';
import React from 'react';
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
   <AuthGuard>
        <div className='flex min-h-screen bg-slate-50'>
            <Sidebar />
            <main className='flex-1'>
              <div className='mx-auto w-full max-w-6xl p-6'>
                {children}
              </div>
            </main>
         </div>
   </AuthGuard>
  )
}

export default DashboardLayout
