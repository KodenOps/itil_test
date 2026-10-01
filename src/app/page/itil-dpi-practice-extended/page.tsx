"use client";
import Practise from "@/app/components/practise/Practice";
import React, { useEffect } from "react";
import { itilDpiQuestions } from "@/data/itil-dpi-questionbank";
const page = () => {
  let num = itilDpiQuestions.length;
  useEffect(() => {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") {
      console.warn("localStorage is not available in this environment.");
    } else {
      localStorage.clear();
    }
  }, []);
  return (
    <div>
      <Practise
        questionBank={itilDpiQuestions}
        qnumber={num}
        duration={21600}
      />
    </div>
  );
};

export default page;
