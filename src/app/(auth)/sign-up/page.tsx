"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import * as z from "zod";
import { Label } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, fetcher } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { format } from "date-fns";
import { Eps, DocumentType, VehicleBrand } from "@/lib/schema";
import es from "date-fns/locale/es";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  firstname: z
    .string({
      required_error: "Nombre es requerido",
    })
    .min(3, {
      message: "Nombre debe tener al menos 3 letras",
    }),
  nickname: z
    .string({
      required_error: "Apodo requerido",
    })
    .min(3, {
      message: "Apodo debe tener al menos 3 letras",
    }),
  documentNumber: z.coerce
    .number({
      required_error: "Documento es requerido",
      invalid_type_error: "El documento debe ser numérico",
    })
    .int()
    .gte(10000000, {
      message: "Cedula debe tener al menos 8 digitos",
    })
    .lte(9999999999, {
      message: "Cedula no puede tener más de 10 digitos",
    }),
  phone: z.coerce
    .number({
      required_error: "Teléfono requerido",
      invalid_type_error: "El teléfono debe ser numérico",
    })
    .int()
    .gte(3000000000)
    .lte(3299999999),
  contactPhone: z.coerce
    .number({
      required_error: "Teléfono requerido",
      invalid_type_error: "El teléfono debe ser numérico",
    })
    .int()
    .gte(3000000000)
    .lte(3299999999),
  contactName: z
    .string({
      required_error: "Nombre contacto es requerido",
    })
    .min(3, {
      message: "Nombre debe tener al menos 3 letras",
    }),
  rh: z
    .string({
      required_error: "Por favor seleccione un grupo sanguíneo",
    })
    .min(2)
    .max(3),
  birthdate: z.date({
    required_error: "Fecha de nacimiento es requerida",
  }),
  bio: z
    .string({ required_error: "Información requerida" })
    .min(10, {
      message: "Información debe tener al menos 10 carácteres",
    })
    .max(160, {
      message: "Información no debe tener más de 160 carácteres",
    }),
  eps: z.string({
    required_error: "Por favor seleccione una EPS",
  }),
  documentType: z.string({ required_error: "Tipo de documento requerido" }),
  job: z.string({ required_error: "Profesión requerida" }),
  terms: z
    .boolean({ required_error: "Se requiere aceptar términos y condiciones" })
    .refine((value) => value === true, {
      message: "Se requiere aceptar términos y condiciones",
    }),
  file: z
    .any()
    .refine((file) => file?.length == 1, "Factura es requerida")
    .refine(
      (file) => file[0]?.type === "application/pdf",
      "La factura debe encontrarse en PDF"
    )
    .refine((file) => file[0]?.size <= 4500000, "El tamaño máximo es 4.5MB"),
  vehicleType: z.string({ required_error: "Tipo de vehículo requerido" }),
});

const locale = es;

export default function Page() {
  const { data: documentTypeList } = useSWRImmutable<DocumentType[]>(
    "/api/document",
    fetcher
  );
  const { data: epsList } = useSWRImmutable<Eps[]>("/api/eps", fetcher);
  const { data: brandList } = useSWRImmutable<VehicleBrand[]>("/api/brand");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const fileRef = form.register("file", { required: true });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [epsOpen, setEpsOpen] = useState(false);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  {
  }
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6"
        >
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.NAME}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.NICKNAME}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormDescription>Como te gusta que te llamen</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.DOCUMENT_TYPE}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={field.value}
                  >
                    <SelectTrigger className="md:w-[230px] sm:w-[380px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypeList?.map((documentType) => (
                        <SelectItem
                          value={documentType.abbreviation}
                          key={documentType.abbreviation}
                        >
                          {documentType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.DOCUMENT_NUMBER}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.JOB}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.PHONE}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eps"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.EPS}
                </FormLabel>
                <Popover open={epsOpen} onOpenChange={setEpsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "md:w-[230px] sm:w-[380px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? epsList?.find((eps) => eps.id === field.value)?.name
                        : "Seleccione EPS"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="md:w-[230px] sm:w-[380px] p-0">
                    <Command>
                      <CommandInput className="h-9" />
                      <CommandEmpty>EPS no encontrada</CommandEmpty>
                      <CommandGroup>
                        {epsList?.map((eps) => (
                          <CommandItem
                            key={eps.id}
                            onSelect={() => {
                              form.setValue("eps", eps.id);
                              setEpsOpen(false);
                            }}
                          >
                            {eps.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                eps.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.EMERGENCY_CONTACT}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  Celular contacto
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rh"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.RH}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="md:w-[230px] sm:w-[380px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.BIRTHDATE}
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "md:w-[230px] sm:w-[380px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown-buttons"
                      selected={field.value}
                      onSelect={(date) => {
                        setCalendarOpen(false);
                        field.onChange(date);
                      }}
                      fromYear={1960}
                      toYear={2023}
                      disabled={(date: Date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  {Label.VEHICLE_TYPE}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="md:w-[230px] sm:w-[380px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Patineta">Patineta</SelectItem>
                      <SelectItem value="Rueda">Rueda</SelectItem>
                      <SelectItem value="Moto">Moto</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  Cómo te enteraste del club?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cuentanos un poco acerca de ti"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Puedes mencionar si alguien te referencio
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                <FormLabel className="text-md font-semibold md:w-1/3 text-gray-900">
                  Factura
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    {...fileRef}
                  />
                </FormControl>
                <FormDescription>
                  En caso de que la factura no se encuentre a tu nombre, sube
                  una declaración juramentada indicando que es de tu propiedad
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {Label.AGREE_TERMS}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 flex justify-center">
            <Button type="submit">Enviar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
