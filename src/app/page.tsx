"use client";

import React from "react";
import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";
import { MdEngineering, MdOutlineWorkOutline } from "react-icons/md";
import { SiKubernetes } from "react-icons/si";
import PreloadVismeForm from "./components/PreloadVismeForm";
import Footer from "./components/Footer";

const Page = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    localStorage.clear();
    router.push(path);
  };

  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <PreloadVismeForm />
      <NavBar />
      <main className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(38,96,164,0.10),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(31,138,112,0.08),_transparent_26%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_55%,_#eef2f7_100%)]' />
        <div className='absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-[#2660A4]/10 blur-3xl' />
        <div className='absolute right-[-6rem] top-56 -z-10 h-80 w-80 rounded-full bg-[#F97316]/10 blur-3xl' />

        <section className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14 md:px-10 lg:px-12'>
          <div className='max-w-4xl'>
            <div className='inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200/70 backdrop-blur'>
              CertifyHub exam prep portal
            </div>
            <h1 className='mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl'>
              Pick a track, then study with a cleaner, sharper learning path.
            </h1>
            <p className='mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg'>
              Choose the exam or learning lane you want to focus on. Each path
              is designed to feel clear, visual, and immediately useful, so you
              can move from overview to practice without friction.
            </p>
          </div>

          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {[
              {
                path: "/page/itil-v4",
                label: "ITIL V4",
                description:
                  "Process thinking, service value, and exam practice built around the ITIL path.",
                IconName: MdOutlineWorkOutline,
                accent: "from-[#2660A4] to-[#4F8FCA]",
              },
              {
                path: "/page/kcna-home",
                label: "KCNA",
                description:
                  "Kubernetes fundamentals, practice flow, and study structure for cloud-native learners.",
                IconName: SiKubernetes,
                accent: "from-[#26a465] to-[#39c682]",
              },
              {
                path: "/page/devops-sys-engineer",
                label: "DevOps & Sys Eng",
                description:
                  "Architecture, reliability, production sense, and the skills that make systems durable.",
                IconName: MdEngineering,
                accent: "from-[#6D2E46] to-[#A24E67]",
              },
            ].map(({ path, label, description, IconName, accent }) => (
              <button
                key={label}
                type='button'
                onClick={() => handleNavigation(path)}
                className='group rounded-[28px] border border-slate-200 bg-white p-4 text-left shadow-lg shadow-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-2xl'
              >
                <div
                  className={`rounded-[22px] bg-gradient-to-br ${accent} p-6 text-white`}
                >
                  <div className='flex h-full min-h-[260px] flex-col justify-between gap-8 rounded-[18px] bg-slate-950/10 p-5 backdrop-blur-sm'>
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.3em] text-white/80'>
                          Learning track
                        </p>
                        <h2 className='mt-3 text-3xl font-black leading-tight'>
                          {label}
                        </h2>
                      </div>
                      <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white'>
                        Open
                      </span>
                    </div>

                    <div className='space-y-4'>
                      <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/15'>
                        <IconName size={36} />
                      </div>
                      <p className='max-w-sm text-sm leading-6 text-white/90'>
                        {description}
                      </p>
                    </div>

                    <div className='flex items-center justify-between gap-3 text-sm font-semibold text-white/85'>
                      <span>Jump into the pathway</span>
                      <span className='rounded-full border border-white/20 bg-white/10 px-4 py-2 transition group-hover:bg-white/20'>
                        Continue
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className='grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 md:grid-cols-3'>
            {[
              "Clear exam entry points",
              "Visually rich study paths",
              "Fast navigation into practice or materials",
            ].map((item) => (
              <div key={item} className='rounded-2xl bg-slate-50 p-5'>
                <p className='text-sm font-semibold text-slate-900'>{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
