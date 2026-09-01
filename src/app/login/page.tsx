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
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      <div className='right md:flex-3 flex-1 md:pt-14 pt-0 md:px-20 px-6 overflow-y-auto h-full'>
        <h3 className='text-3xl capitalize text-[#0E2F5E] text-center md:text-left  font-bold'>
          sign In
        </h3>
        <p className='pt-2 pb-4 text-xl text-center md:text-left text-[#5A5C78]'>
          Input your credentials to login into your account.
        </p>
        <form className='w-full' onSubmit={(e) => e.preventDefault()}>
          <label
            htmlFor='email'
            className='text-sm font-medium text-[#0E2F5E] md:block hidden'
          >
            Email Address
          </label>
          <input
            type='text'
            placeholder='Email Address'
            name='email'
            className='w-full mt-2'
          />
          <label
            htmlFor='password'
            className='text-sm font-medium text-[#0E2F5E] md:block hidden'
          >
            Password
          </label>
          <input
            type='password'
            placeholder='Password'
            name='password'
            className='w-full mt-2'
          />
          <button
            type='submit'
            className='w-full mt-4 py-4 bg-[#0E2F5E] text-white rounded-md'
          >
            Sign In
          </button>
        </form>
        <div className='flex items-center gap-4 mt-8 justify-center'>
          <div className='flex-1 border-t border-gray-400'></div>
          <span className='text-gray-700'>Alternative Login</span>
          <div className='flex-1 border-t border-gray-400'></div>
        </div>
        <div className='buttonSocial flex flex-wrap items-center gap-4 mt-8 justify-center'>
          {(errorMessage || urlError) && (
            <p className='mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700'>
              {urlError === "access_denied"
                ? "That Google account isn't authorized for this site."
                : errorMessage ||
                  "Something went wrong signing in. Please try again."}
            </p>
          )}
          <button
            className='w-full py-4 border-[1px] border-gray-400 rounded-md flex items-center justify-center gap-2'
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <FcGoogle size={24} />
            {isLoading ? "Redirecting to Google…" : "Sign In with Google"}
          </button>
          <button className='w-full py-4 border-[1px] border-gray-400 rounded-md flex items-center justify-center gap-2'>
            <SiFacebook size={24} />
            Sign in With Facebook{" "}
          </button>
        </div>
        <h3 className='text-center mt-8 pb-10'>
          New to MyCertifyHub?{" "}
          <a href='#' className='font-bold text-[#0D2C5D]'>
            Sign Up Now
          </a>
        </h3>
      </div>
    </section>
  );
};

export default page;
