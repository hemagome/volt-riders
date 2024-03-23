import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("Home");
  const slides = [
    { url: "/Asado.jpg" },
    { url: "/Rodada1.jpg" },
    { url: "/Rodada2.jpg" },
    { url: "/WeRacingRuedas.webp" },
    { url: "/Rodada3.jpg" },
    { url: "/WeRacingRuedas2.webp" },
  ];

  return (
    <>
      <br />
      <h2 className="text-3xl mb-4 flex flex-col items-center">
        {t("welcomeMessage")}
      </h2>
      <br />
      <Carousel>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={slide.url}>
              <Image
                alt="Foto rodada"
                className="mb-8"
                width={720}
                height={720}
                src={slide.url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
