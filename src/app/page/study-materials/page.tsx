import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import React from "react";
import { FaBook } from "react-icons/fa";

interface Material {
  id: string;
  title: string;
  type: "pdf" | "pptx";
  linkToFile?: string;
  colour: string;
}

const Page = () => {
  const materials: Material[] = [
    {
      id: "exam-guidelines",
      title: "Exam Guidelines",
      type: "pdf",
      colour: "#2660A4",
    },
    {
      id: "itil-textbook",
      title: "ITIL Foundation Textbook",
      type: "pdf",

      colour: "#26a465",
    },
    {
      id: "itil-exam-study",
      title: "ITIL Foundation Exam Study",
      type: "pdf",

      colour: "#171738",
    },
    {
      id: "itil-slides",
      title: "ITIL Foundation Slide",
      type: "pdf",

      colour: "#333",
    },
  ];

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <NavBar />
      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />
        <section className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/70 backdrop-blur'>
              Study materials
            </div>
            <h1 className='mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
              Study Materials
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
              Here you can find various study materials files to help you
              prepare for your ITIL exam.
            </p>

            <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
              {materials.map((material) => (
                <Link
                  key={material.id}
                  href={`/page/material/${material.id}`}
                  className='group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
                >
                  <div className='rounded-[22px] bg-gradient-to-br from-[#2660A4] to-[#4F8FCA] p-6 text-white'>
                    <div className='flex h-full min-h-[220px] flex-col justify-between gap-8 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                      <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/15'>
                        <FaBook size={34} />
                      </div>
                      <div>
                        <h3 className='text-2xl font-black'>
                          {material.title}
                        </h3>
                        <p className='mt-2 text-sm text-white/90'>
                          {material.type.toUpperCase()} file
                        </p>
                      </div>
                      <span className='inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold'>
                        Open material
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <div className='w-full flex justify-center'>
        <a
          href='/'
          className='text-lg text-center w-full  text-[#2660A4] underline mt-6 p-4 cursor-pointer'
        >
          Go back Home
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
