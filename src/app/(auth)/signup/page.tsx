"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  firstname: z.string({
    required_error: "Nombre es requerido",
  }).min(3, {
    message: "Nombre debe tener al menos 3 letras",
  }),
  lastname: z.string({
    required_error: "Apellidos son requeridos",
  }).min(3, {
    message: "Nombre debe tener al menos 3 letras",
  }),
  cc: z.coerce.number({
    required_error: "Documento es requerido",
    invalid_type_error: "El documento debe ser numérico",
  }).int().gte(10000000, {
    message: "Cedula debe tener al menos 8 digitos",
  }).lte(9999999999, {
    message: "Cedula no puede tener más de 10 digitos",
  }),
  phone: z.coerce.number({
    required_error: "Teléfono requerido",
    invalid_type_error: "El teléfono debe ser numérico",
  }).int().gte(3000000000).lte(3299999999),
  contactPhone: z.coerce.number({
    required_error: "Teléfono requerido",
    invalid_type_error: "El teléfono debe ser numérico",
  }).int().gte(3000000000).lte(3299999999),
  contactName: z.string({
    required_error: "Nombre es requerido",
  }).min(3, {
    message: "Nombre debe tener al menos 3 letras",
  }),
  rh: z.string({
    required_error: "Por favor seleccione una opción",
  }).min(2).max(3),
  birthdate: z.date({
    required_error: "Fecha de nacimiento es requerida",
  }),
})

export default function Page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Beatriz Aurora" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Pinzón Solano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número documento</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
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
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="3007207091" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto de emergencia</FormLabel>
              <FormControl>
                <Input placeholder="Mamá" {...field} />
              </FormControl>
              <FormDescription>
                Nombre contacto de emergencia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular contacto</FormLabel>
              <FormControl>
                <Input placeholder="3007207091" {...field} />
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
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="O+" />
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
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
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}
