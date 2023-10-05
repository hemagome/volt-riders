import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/signup">Registrarse</Link>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/VoltRiders.webp"
          alt="Logo VoltRiders"
          className="dark:invert"
          width={100}
          height={24}
          priority
        />
      </a>
      <iframe src="https://app.sab.gov.co/sab/lluvias.htm" width="600" height="400"></iframe>
      <Image
        src="/VoltRiders.webp"
        alt="Logo VoltRiders"
        width={180}
        height={37}
        priority
      />
    </main>
  )
}
