import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type CardProps = React.ComponentProps<typeof Card> & {
  data: { name: string; position: string; photo: string; message: string };
};

export function PresentationCard({ className, ...props }: CardProps) {
  const { data } = props;
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.position}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image src={data.photo} alt="Foto" width={200} height={48} />
      </CardContent>
      <CardFooter>{data.message}</CardFooter>
    </Card>
  );
}
