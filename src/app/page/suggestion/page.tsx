"use client";
import React, { useState } from "react";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState(""); // <-- state for toggling

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!category) return alert("Please select a category!");
    setLoading(true);
    setSuccess(false);

    const form = e.currentTarget;
    const nickname = form.nickname.value;
    const message = form.message.value;

    const data = new FormData();
    data.append("entry.365554737", nickname);
    data.append("entry.1431201800", category);
    data.append("entry.1015083103", message);

    await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSdH0mps98HT0sjwj13YfInLSb5heGpiZxMkl_DlN-2Kw57MBw/formResponse",
      { method: "POST", body: data, mode: "no-cors" },
    );

    setLoading(false);
    setSuccess(true);
    form.reset();
    setCategory(""); // reset toggle
  }

  return (
    <div className='w-full min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />
        <section className='mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/70 backdrop-blur'>
              Feedback center
            </div>
            <h1 className='mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
              Suggestions & Ideas Submission
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
              Kindly fill the form below to suggest new ideas or features you
              would like to see on this platform.
            </p>
          </div>

          <div className='mx-auto w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8'>
            <form
              onSubmit={handleSubmit}
              className='flex h-auto w-full flex-col gap-4 rounded-[22px] border border-slate-100 bg-white p-6 md:p-8'
            >
              <input
                type='text'
                name='nickname'
                placeholder='Your Nickname *'
                required
              />

              {/* Category toggle divs */}
              <div className='flex gap-4 mb-4 items-center flex-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6'>
                <h3 className='md:text-lg text-md font-mono text-[#2660A4]'>
                  Category (select one):{" "}
                </h3>
                <div className='w-full flex items-center flex-wrap gap-4 md:justify-start justify-center'>
                  {["Suggestion", "Report Bug"].map((option) => (
                    <div
                      key={option}
                      onClick={() => setCategory(option)}
                      className={`cursor-pointer px-4 py-2 rounded-lg border md:w-[30%] w-full text-center
										${category === option ? "bg-[#2660A4] text-white border-[#2660A4]" : "bg-white text-slate-700 hover:text-white border-slate-200"}
										hover:bg-[#1a4a80] hover:text-slate-100 transition-colors duration-200`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                name='message'
                placeholder='Your Suggestion or Idea *'
                rows={5}
                required
              />

              <button
                disabled={loading}
                className='bg-[#2660A4] text-white p-[15px] md:w-[40%] w-full rounded-full hover:bg-[#1a4a80] transition-colors duration-300 disabled:opacity-60'
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

              {success && (
                <p className='text-green-600 text-center'>
                  Submitted successfully 🎉
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
