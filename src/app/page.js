"use client";

import { useEffect } from "react";
import { loginUser } from "@/services/authApi";

export default function Home() {


  const testLogin = async () => {

      try {

        const res = await loginUser({
          email: "admin@projectflow.com",
          password: "Admin@123"
        });

        console.log(res);

      } catch (err) {
        console.error(err);
      }

    };

  useEffect(() => {

    
    testLogin();

  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        ProjectFlow Frontend Connected
      </h1>
    </div>
  );
}