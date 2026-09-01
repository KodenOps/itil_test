import mylogo2 from "../../../public/logo_black.svg";
import Image from "next/image";
import SideView from "../components/SideView";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

const page = () => {
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
