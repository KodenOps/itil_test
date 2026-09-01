"use client";
import mylogo from "@/public/logo_white.png";
import mylogo2 from "../../../public/logo_black.svg";
import line from "@/public/line.svg";
import Image from "next/image";
import { MdFormatQuote } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import ReviewBar from "../components/ReviewBar";
import SideView from "../components/SideView";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoginForm from "./LoginForm";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          callbackUrl,
        )}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };
  return (
    <section className='mainpage'>
      <SideView />
      {/* sign in form */}
      <div className='w-full flex justify-center items-center md:hidden'>
        <Image src={mylogo2} alt='Logo' width={80} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
};

export default page;
