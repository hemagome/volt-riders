import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-5xl font-bold text-[#e3342e] dark:text-[#ed7f33] mb-4">
        404
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
        Oops! La página que estas búscando no existe
      </p>
      <Image
        alt="Feas"
        className="mb-8"
        height="200"
        src="/Feas.webp"
        style={{
          aspectRatio: "200/200",
          objectFit: "cover",
        }}
        width="200"
        priority
      />
      <Link
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#29235C] hover:bg-[#13152E]"
        href="/"
      >
        Volver
      </Link>
    </section>
  );
}
