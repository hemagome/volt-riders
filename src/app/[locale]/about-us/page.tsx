import { PresentationCard } from "@/components/card";
import { useTranslations } from "next-intl";
const tableMembers = [
  {
    name: "Camila Narvaez",
    position: "CEO",
    message: "La sultana del mal",
    photo: "/VoltRiders.webp",
  },
  {
    name: "Germán Ávila",
    position: "Diseñador UX & UI",
    message: "No sabemos como lo vamos a pensionar",
    photo: "/VoltRiders.webp",
  },
  {
    name: "Emilio Tobón",
    position: "Lider comite de despilfarro",
    message: "Alguién dijo guaro?",
    photo: "/VoltRiders.webp",
  },
  {
    name: "Javi Borrero",
    position: "Un bacan",
    message: "No se me ocurrió que escribir",
    photo: "/VoltRiders.webp",
  },
  {
    name: "Hector Gomez",
    position: "Desarrollador web Volt Riders",
    message: "No se me ocurrió que escribir x2",
    photo: "/VoltRiders.webp",
  },
];

export default function Page() {
  const t = useTranslations("AboutUs");
  return (
    <>
      <br />
      <h1 className="text-3xl mb-4 flex flex-col items-center">
        {t("knowUs")}
      </h1>
      <div className="w-screen h-screen flex justify-center p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
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
