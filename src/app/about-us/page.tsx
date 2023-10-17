import { PresentationCard } from "@/components/card";
import { Label } from "@/lib/constants";
const tableMembers = [
  {
    name: "Camila Narvaez",
    position: "CEO",
    message: "La sultana del mal",
    photo:
      "https://scontent.fbog19-1.fna.fbcdn.net/v/t39.30808-6/369861120_10223177801901814_3556368077879028169_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE9fKCk_8S9goeDkvJXvgYf7Nit-h9WTATs2K36H1ZMBJ5aMu6nFxo2Em306yFJgtA&_nc_ohc=G2i9MkNK1_0AX_JcZ_u&_nc_ht=scontent.fbog19-1.fna&oh=00_AfA4sgDZQk_83KmPNi-dp9WFqEffq0lPEB88rTaSV4bAEw&oe=65338D54",
  },
  {
    name: "Germán Ávila",
    position: "Diseñador UX & UI",
    message: 'El "veterano"',
    photo: "/VoltRiders.webp",
  },
  {
    name: "Emilio Tobón",
    position: "Lider comite de despilfarro",
    message: "Alguién dijo guaro?",
    photo:
      "https://scontent.fbog19-1.fna.fbcdn.net/v/t1.18169-9/15107255_10154722003069127_8723863155404473035_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=be3454&_nc_eui2=AeEnp292MFxwALo_0X4KkI_STC9amKOdXBFML1qYo51cEbJxKuYQf9rbH8LSqqcX6x0&_nc_ohc=PrDJTYK6H-0AX-qv9Le&_nc_ht=scontent.fbog19-1.fna&oh=00_AfDDFmLCZ15fx_dcXchpQoRDcOZeOyD7F3wZ6cnxRvklRQ&oe=65564626",
  },
  {
    name: "Felipe Rodriguez",
    position: "Seguridad vial",
    message: "No se me ocurrió que escribir",
    photo: "/VoltRiders.webp",
  },
  {
    name: "Hector Gomez",
    position: "Mamando gallo",
    message: "No se me ocurrió que escribir x2",
    photo:
      "https://scontent.fbog19-1.fna.fbcdn.net/v/t39.30808-6/327090634_1225393535070872_1576405973038129199_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHq0gkmDS94bmsClqvbtDGW4v8eVJFeJY_i_x5UkV4lj5_-hK9WkfZyD6579-b7le8&_nc_ohc=Occ04IsDfp0AX_h0EQa&_nc_ht=scontent.fbog19-1.fna&oh=00_AfAYWxwJYjPkFmz-LunjR1yZpWF8WGvYCYmU-pCuoDXALA&oe=653459B6",
  },
];

export default function Page() {
  return (
    <>
      <h1 className="text-3xl mb-4 flex flex-col items-center">
        {Label.KNOW_US}
      </h1>
      <div className="w-screen h-screen flex justify-center p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {tableMembers.map((member) => (
            <div key={member.name}>
              <PresentationCard data={member} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
