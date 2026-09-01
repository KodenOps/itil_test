import img1 from "../../public/avatar01.png";
import img2 from "../../public/avatar02.png";
import img3 from "../../public/avatar03.png";
import img4 from "../../public/avatar04.png";
import img5 from "../../public/avatar05.png";
import img6 from "../../public/avatar06.png";
import img7 from "../../public/avatar07.png";
import img8 from "../../public/avatar08.png";
import img9 from "../../public/avatar09.png";
import img10 from "../../public/avatar10.png";
import type { StaticImageData } from "next/image";

interface Review {
  id: number;
  name: string;
  role: string;
  review: string;
  image: StaticImageData;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "John Doe",
    review:
      "mycertifyhub transformed my certification journey! The comprehensive question banks and practice exams gave me the confidence to ace my AWS certification on the first try. The platform's intuitive design makes studying enjoyable, and I've gained practical skills that directly apply to my work.",
    image: img1,
    role: "Cloud Engineer | AWS Certified",
  },
  {
    id: 2,
    name: "Jane Smith",
    review:
      "I was skeptical about online learning platforms, but mycertifyhub exceeded my expectations. The curated learning materials are current and relevant, and the practice tests accurately mirror real exam conditions. I successfully passed my ITIL certification and recommend it to everyone.",
    image: img2,
    role: "IT Manager | ITIL v5 Certified",
  },
  {
    id: 3,
    name: "Michael Brown",
    review:
      "As someone juggling multiple projects, mycertifyhub's flexible learning environment was perfect for me. The platform offers diverse certification paths, from cloud technologies to DevOps. I've completed three certifications in less than a year thanks to their structured approach.",
    image: img3,
    role: "DevOps Engineer | Multi-Certified",
  },
  {
    id: 4,
    name: "Emily Davis",
    review:
      "mycertifyhub is a game-changer for professional development. The real-world scenario practice and detailed explanations helped me understand not just the 'what' but the 'why' behind each concept. I'm now more confident in my technical abilities and career prospects.",
    image: img4,
    role: "Systems Administrator | KCNA Certified",
  },
  {
    id: 5,
    name: "Chris Johnson",
    review:
      "The quality of content on mycertifyhub is unmatched. Every lesson is well-structured, and the interactive practice sections reinforce learning effectively. I've recommended it to my entire team, and several colleagues have already earned their certifications.",
    image: img5,
    role: "Senior Developer | Multi-Certified Professional",
  },
  {
    id: 6,
    name: "Sophia Martinez",
    review:
      "mycertifyhub provided the perfect balance between theory and hands-on practice. The extensive question banks ensure you're thoroughly prepared for your exam, and the community support kept me motivated throughout my learning journey. Best investment I made for my career.",
    image: img6,
    role: "Solutions Architect | Certified Professional",
  },
  {
    id: 7,
    name: "David Wilson",
    review:
      "I appreciate how mycertifyhub keeps their content updated with the latest industry standards. The platform's user-friendly interface made studying a breeze, and the progress tracking features helped me stay organized. I passed my certification exam with flying colors.",
    image: img7,
    role: "Full-Stack Developer | Certified",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    review:
      "mycertifyhub makes certification preparation accessible and engaging. The mix of learning materials, practice tests, and real-world scenarios creates a comprehensive learning experience. I've already earned two certifications and I'm pursuing my third.",
    image: img8,
    role: "Project Manager | PMP & ITIL Certified",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    review:
      "The detailed explanations and step-by-step learning paths on mycertifyhub eliminated my exam anxiety. Every topic is covered thoroughly, and the practice questions helped me identify weak areas before the actual exam. Highly recommend for anyone serious about certifications.",
    image: img9,
    role: "Network Administrator | Cisco Certified",
  },
  {
    id: 10,
    name: "Sophia Lee",
    review:
      "mycertifyhub is more than just a platform; it's a complete learning ecosystem. From foundational concepts to advanced technologies, every course is expertly designed. I've transformed my career trajectory thanks to the certifications I earned through this platform.",
    image: img10,
    role: "Technology Consultant | Multi-Certified",
  },
];
