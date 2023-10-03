import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>No se pudo encontrar el recurso búscado</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}