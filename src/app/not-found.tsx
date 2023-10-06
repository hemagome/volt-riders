import Link from 'next/link';
import Image from 'next/image';
 
export default function NotFound() {
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <h2>No encontrado</h2>
      <p>No se pudo encontrar el recurso búscado</p>
      <br />
      <br />
      <br />
      <Link href="/">Volver</Link>
      <Image
        src="/Feas.jpg"
        alt="Feas"
        layout='fill'
        objectFit='contain'
      />
    </div>
  )
}