"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDaysIcon, ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, fetcher } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Eps, DocumentType, VehicleBrand, VehicleType } from "@/lib/schema";
import es from "date-fns/locale/es";
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
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/MultiFileDropzone";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useState, useRef, useEffect } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useForm, useFieldArray } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  fullname: z
    .string({
      required_error: "Nombre es requerido",
    })
    .min(3, {
      message: "Nombre debe tener al menos 3 letras",
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
  vehicles: z
    .array(
      z.object({
        file: z.any(),
        vehicleType: z
          .string({ required_error: "Tipo de vehículo requerido" })
          .min(1, { message: "Tipo de vehículo requerido" }),
        brand: z
          .string({ required_error: "Marca de vehículo requerida" })
          .min(1, { message: "Marca de vehículo requerida" }),
      }),
    )
    .nonempty({ message: "Vehículo es requerido" }),
  gender: z.string({ required_error: "Género requerido" }),
  relationship: z.string({ required_error: "Género requerido" }),
  bio: z
    .string({ required_error: "Información requerida" })
    .min(10, {
      message: "Información debe tener al menos 10 carácteres",
    })
    .max(160, {
      message: "Información no debe tener más de 160 carácteres",
    })
    .optional(),
  nickname: z
    .string({
      required_error: "Apodo requerido",
    })
    .min(3, {
      message: "Apodo debe tener al menos 3 letras",
    })
    .optional(),
});

const locale = es;

interface SignUpFormProps {
  name: string;
  nickname: string;
  documentType: string;
  documentNumber: string;
  job: string;
  cellphone: string;
  eps: string;
  rh: string;
  birthdate: string;
  invoice: string;
  agreeTerms: string;
  vehicleType: string;
  vehicleBrand: string;
  nicknameDescription: string;
  selectEps: string;
  howKnowUs: string;
  submit: string;
  dragDrop: string;
  referMessage: string;
  aboutYou: string;
  selectDate: string;
  invoiceDescription: string;
  gender: string;
  relationship: string;
}

export default function SignUpForm(props: SignUpFormProps) {
  const {
    name,
    nickname,
    documentType,
    documentNumber,
    job,
    cellphone,
    eps,
    rh,
    birthdate,
    invoice,
    agreeTerms,
    vehicleBrand,
    vehicleType,
    nicknameDescription,
    selectEps,
    howKnowUs,
    submit,
    dragDrop,
    referMessage,
    aboutYou,
    selectDate,
    invoiceDescription,
    gender,
    relationship,
  } = props;
  const { data: brandList } = useSWRImmutable<VehicleBrand[]>(
    "/api/vehicle/brand",
    fetcher,
  );
  const { data: documentTypeList } = useSWRImmutable<DocumentType[]>(
    "/api/document",
    fetcher,
  );
  const { data: epsList } = useSWRImmutable<Eps[]>("/api/eps", fetcher);
  const { data: vehicleTypeList } = useSWRImmutable<VehicleType[]>(
    "/api/vehicle/type",
    fetcher,
  );
  const ref = useRef<HTMLHeadingElement>(null);
  const { edgestore } = useEdgeStore();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(""); // Estado local para el vehicleType seleccionado
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Estado para almacenar las marcas seleccionadas
  const [readTerms, setReadTerms] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
  });

  const { fields, append } = useFieldArray({
    name: "vehicles",
    control: form.control,
  });

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [epsOpen, setEpsOpen] = useState(false);
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Diligenciaste los siguientes datos",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Párrafo completamente visible");
        }
      });
    });
    const currentReadTerms = ref.current;
    if (currentReadTerms) {
      observer.observe(currentReadTerms);
    }
    return () => {
      if (currentReadTerms) {
        observer.unobserve(currentReadTerms);
      }
    };
  }, [ref]);

  return (
    <div className="flex justify-center min-h-screen p-4 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-2/3 space-y-6 md:space-y-0 md:grid md:grid-cols-3 md:gap-6"
        >
          <Label className="text-xl md:col-span-3">Información personal</Label>
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {name}
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {gender}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="md:w-[230px] sm:w-[380px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="LGTBIQ+">39 tipos de gay</SelectItem>
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
                <FormLabel className="text-md font-semibold">
                  {birthdate}
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "md:w-[230px] sm:w-[380px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP", { locale })
                        ) : (
                          <span>{selectDate}</span>
                        )}
                        <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
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
            name="documentType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-md font-semibold">
                  {documentType}
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
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
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {documentNumber}
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
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {job}
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
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {cellphone}
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
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {eps}
                </FormLabel>
                <Popover open={epsOpen} onOpenChange={setEpsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "md:w-[230px] sm:w-[380px] justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? epsList?.find((eps) => eps.nit === field.value)?.name
                        : selectEps}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="md:w-[230px] sm:w-[380px] p-0">
                    <Command>
                      <CommandInput className="h-9" />
                      <CommandEmpty>EPS no encontrada</CommandEmpty>
                      <CommandGroup>
                        {epsList?.map((eps) => (
                          <CommandItem
                            key={eps.nit}
                            onSelect={() => {
                              form.setValue("eps", eps.nit);
                              setEpsOpen(false);
                            }}
                          >
                            {eps.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                eps.nit === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
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
            name="rh"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {rh}
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
          <Label className="text-xl md:col-span-3">
            Contacto de emergencia
          </Label>
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {name}
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
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {cellphone}
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
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {relationship}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label className="text-xl md:col-span-3">Información opcional</Label>
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {nickname}
                </FormLabel>
                <FormControl>
                  <Input className="md:w-[230px] sm:w-[380px]" {...field} />
                </FormControl>
                <FormDescription>{nicknameDescription}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {howKnowUs}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={aboutYou}
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{referMessage}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label className="text-xl md:col-span-3">Información vehículo</Label>
          <br className="md:hidden" />
          <Label className="md:col-span-3 text-sm text-muted-foreground">
            Si quieres registrar más de 1 vehículo, debes adjuntar una factura
            por cada uno
          </Label>
          <FormField
            control={form.control}
            name="vehicles"
            render={() => (
              <FormItem>
                <FormLabel className="text-md font-semibold md:w-1/3">
                  {invoice}
                </FormLabel>
                <FormControl>
                  <MultiFileDropzone
                    messages={{ dragDrop: dragDrop }}
                    className="md:w-[230px] sm:w-[380px]"
                    value={fileStates}
                    dropzoneOptions={{
                      maxFiles: 2,
                      accept: {
                        "application/pdf": [".pdf"],
                        "image/*": [".png", ".jpeg", ".jpg"],
                      },
                    }}
                    onChange={(files) => {
                      setFileStates(files);
                    }}
                    onFilesAdded={async (addedFiles) => {
                      addedFiles.map((acceptedFile) => {
                        return append({
                          file: acceptedFile,
                          vehicleType: "",
                          brand: "",
                        });
                      });
                      setFileStates([...fileStates, ...addedFiles]);
                      await Promise.all(
                        addedFiles.map(async (addedFileState) => {
                          try {
                            const res = await edgestore.publicFiles.upload({
                              file: addedFileState.file,
                              options: {
                                temporary: true,
                              },
                              onProgressChange: async (progress) => {
                                updateFileProgress(
                                  addedFileState.key,
                                  progress,
                                );
                                if (progress === 100) {
                                  // Esperar 1 segundo a setear barra de progreso a 100%
                                  await new Promise((resolve) =>
                                    setTimeout(resolve, 1000),
                                  );
                                  updateFileProgress(
                                    addedFileState.key,
                                    "COMPLETE",
                                  );
                                }
                              },
                            });
                            console.log(res);
                          } catch (err) {
                            updateFileProgress(addedFileState.key, "ERROR");
                          }
                        }),
                      );
                    }}
                  />
                </FormControl>
                <FormDescription className="md:w-[230px] sm:w-[380px]">
                  <a href="https://www.ilovepdf.com/merge_pdf" target="_blank">
                    {invoiceDescription}
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            {fields.map((field, index) => {
              const selectedBrand = selectedBrands[index] || "";
              const vehicleTypeValue = form.getValues(
                `vehicles.${index}.vehicleType`,
              );
              const filteredBrandList = brandList?.filter(
                (brand) => brand.vehicleType?.toString() === vehicleTypeValue,
              );
              return (
                <div key={field.id}>
                  <div className="mt-7 mb-2 text-xl font-bold">
                    {form.getValues(`vehicles.${index}.file.name`)}
                  </div>
                  <div className="flex gap-x-8">
                    <FormField
                      control={form.control}
                      name={`vehicles.${index}.vehicleType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:w-1/3">
                            {vehicleType}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedVehicleType(value);
                              }}
                            >
                              <SelectTrigger className="md:w-[150px] sm:w-[380px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {vehicleTypeList?.map((vehicleType) => (
                                  <SelectItem
                                    value={vehicleType.id.toString()}
                                    key={vehicleType.id}
                                  >
                                    {vehicleType.type}
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
                      key={field.id + 1}
                      name={`vehicles.${index}.brand`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="md:w-1/3">
                            {vehicleBrand}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedBrands((brands) => {
                                  const updatedBrands = [...brands];
                                  updatedBrands[index] = value;
                                  return updatedBrands;
                                });
                              }}
                              disabled={!selectedVehicleType}
                              value={field.value || selectedBrand}
                            >
                              <SelectTrigger className="md:w-[200px] sm:w-[380px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredBrandList?.map((brand) => (
                                  <SelectItem
                                    value={brand.brand}
                                    key={brand.brand}
                                  >
                                    {brand.brand}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <br />
          <Label className="text-xl md:col-span-3">
            Términos y condiciones
          </Label>
          <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 md:col-span-3">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Perferendis assumenda id pariatur, fugiat reprehenderit nesciunt
              temporibus veniam inventore tempore reiciendis nemo delectus, qui
              neque aspernatur similique odio. Veritatis, provident hic. Lorem
              ipsum, dolor sit amet consectetur adipisicing elit. Temporibus
              tempore consequatur, commodi laborum numquam voluptas officia et!
              Consectetur saepe inventore quasi voluptas dolorum veritatis vel
              repudiandae, adipisci iusto dolore quidem. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Doloribus quidem inventore
              quod. Accusamus reiciendis eos sequi natus saepe recusandae quod.
              Aspernatur, unde. Delectus, debitis! Ducimus minus qui dolorem ut
              sunt.
            </p>
            <h2 ref={ref}>Al llegar aqui se debe activar el checkbox</h2>
          </ScrollArea>
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    disabled={!readTerms}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="block mb-2 text-sm font-medium">
                  {agreeTerms}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-3 flex justify-center">
            <Button type="submit">{submit}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
