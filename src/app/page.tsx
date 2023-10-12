import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <iframe
        src="https://app.sab.gov.co/sab/lluvias.htm"
        width="600"
        height="400"
      ></iframe>
    </main>
  );
}
