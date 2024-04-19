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
import { es } from "date-fns/locale";
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
import { useState, useRef, useEffect } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useForm, useFieldArray } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import useSWRImmutable from "swr/immutable";
import { zodResolver } from "@hookform/resolvers/zod";
import OTPInputGroup from "./otpInputs";

export const FormSchema = z
  .object({
    firstName: z
      .string({
        required_error: "Nombre es requerido",
      })
      .min(3, {
        message: "Nombre debe tener al menos 3 letras",
      }),
    lastName: z
      .string({
        required_error: "Apellido es requerido",
      })
      .min(3, {
        message: "Apellido debe tener al menos 3 letras",
      }),
    documentNumber: z.coerce
      .number({
        required_error: "Documento es requerido",
        invalid_type_error: "El documento debe ser numérico",
      })
      .int()
      .gte(10000000, {
        message: "Documento debe tener al menos 8 digitos",
      })
      .lte(9999999999, {
        message: "Documento no puede tener más de 10 digitos",
      }),
    phone: z.coerce
      .number({
        required_error: "Teléfono requerido",
        invalid_type_error: "El teléfono debe ser numérico",
      })
      .int()
      .gte(3000000000, { message: "Celular debe tener 10 digitos" })
      .lte(3299999999, { message: "Celular debe tener 10 digitos" }),
    contactPhone: z.coerce
      .number({
        required_error: "Teléfono requerido",
        invalid_type_error: "El teléfono debe ser numérico",
      })
      .int()
      .gte(3000000000, { message: "Celular debe tener 10 digitos" })
      .lte(3299999999, { message: "Celular debe tener 10 digitos" }),
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
          url: z.string(),
        }),
      )
      .nonempty({ message: "Factura requerida" }),
    gender: z.string({ required_error: "Género requerido" }),
    relationship: z.string({ required_error: "Parentesco requerido" }),
    mail: z
      .string({ required_error: "Correo electrónico requerido" })
      .email({ message: "Correo electrónico invalido" }),
    password: z.string({ required_error: "Contraseña requerida" }),
    confirm: z.string({ required_error: "Contraseña requerida" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Contraseñas no concuerdan",
    path: ["confirm"],
  });

const locale = es;

interface SignUpFormProps {
  documentType: string;
  documentNumber: string;
  cellphone: string;
  eps: string;
  rh: string;
  birthdate: string;
  invoice: string;
  agreeTerms: string;
  vehicleType: string;
  vehicleBrand: string;
  selectEps: string;
  submit: string;
  dragDrop: string;
  selectDate: string;
  invoiceDescription: string;
  gender: string;
  relationship: string;
  emergencyContact: string;
  personalData: string;
  male: string;
  female: string;
  nonBinary: string;
  vehicleData: string;
  terms: string;
  invoiceAdvice: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mail: string;
  password: string;
  confirmPassword: string;
  verify: string;
  sentCode: string;
}

export default function SignUpForm(props: SignUpFormProps) {
  const {
    documentType,
    documentNumber,
    cellphone,
    eps,
    rh,
    birthdate,
    invoice,
    agreeTerms,
    vehicleBrand,
    vehicleType,
    selectEps,
    submit,
    dragDrop,
    selectDate,
    invoiceDescription,
    gender,
    relationship,
    emergencyContact,
    personalData,
    male,
    female,
    nonBinary,
    vehicleData,
    terms,
    invoiceAdvice,
    firstName,
    lastName,
    fullName,
    mail,
    password,
    confirmPassword,
    verify,
    sentCode,
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { edgestore } = useEdgeStore();
  const [epsOpen, setEpsOpen] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [pendingVerification, setPendingVerification] = useState(false); //Cambiado para pruebas
  const [readTerms, setReadTerms] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const { isLoaded, signUp } = useSignUp();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      mail: "",
      contactName: "",
      relationship: "",
    },
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!isLoaded) {
      return;
    }
    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone.toString(),
        emailAddress: data.mail,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setReadTerms(true);
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
      {!pendingVerification && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-2/3"
          >
            {/* Sección de Datos Personales */}
            <div className="md:grid md:grid-cols-3 md:gap-6 py-8 space-y-6 md:space-y-0">
              <Label className="text-xl md:col-span-3">{personalData}</Label>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {firstName}
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {lastName}
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
                          <SelectItem value="F">{female}</SelectItem>
                          <SelectItem value="M">{male}</SelectItem>
                          <SelectItem value="LGTBIQ+">{nonBinary}</SelectItem>
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
                          toYear={new Date().getFullYear()}
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
                            ? epsList?.find((eps) => eps.nit === field.value)
                                ?.name
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
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {mail}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {password}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="md:w-[230px] sm:w-[380px]"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {confirmPassword}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="md:w-[230px] sm:w-[380px]"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Sección de Contacto de Emergencia */}
            <div className="md:grid md:grid-cols-3 md:gap-6 py-8 space-y-6 md:space-y-0">
              <Label className="text-xl md:col-span-3">
                {emergencyContact}
              </Label>
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md font-semibold md:w-1/3">
                      {fullName}
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
            </div>
            {/* Sección de Datos de Vehículos */}
            <div className="md:grid md:grid-cols-3 md:gap-6 py-8 space-y-6 md:space-y-0">
              <Label className="text-xl md:col-span-3">{vehicleData}</Label>
              <br className="md:hidden" />
              <Label className="md:col-span-3 text-sm text-muted-foreground">
                {invoiceAdvice}
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
                                addedFiles.map((acceptedFile) => {
                                  return append({
                                    file: acceptedFile,
                                    vehicleType: "",
                                    brand: "",
                                    url: res.url,
                                  });
                                });
                                setFileStates([...fileStates, ...addedFiles]);
                              } catch (err) {
                                console.error("Error al subir archivo:", err);
                                updateFileProgress(addedFileState.key, "ERROR");
                              }
                            }),
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription className="md:w-[230px] sm:w-[380px]">
                      <a
                        href="https://www.ilovepdf.com/merge_pdf"
                        target="_blank"
                      >
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
                    (brand) =>
                      brand.vehicleType?.toString() === vehicleTypeValue,
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <br />
            </div>
            {/* Sección de Términos y Condiciones */}
            <div className="md:grid md:grid-cols-1 md:gap-6 py-8 space-y-6 md:space-y-0">
              <Label className="text-xl ">{terms}</Label>
              <ScrollArea className="h-[200px] w-[380px] rounded-md border p-4 md:col-span-1">
                <b>
                  <h1 className="flex justify-center">VOLT RIDERS CLUB</h1>
                  <h1 className="flex justify-center">REGLAMENTO GENERAL</h1>
                  <br />
                  <h2 className="flex justify-center">CAPITULO I</h2>
                  <h2 className="flex justify-center">
                    DE LA IDENTIFICACIÓN DEL CLUB
                  </h2>
                  <h3>Artículo 1º MISIÓN</h3>
                </b>
                <p>
                  Asociar a los propietarios de vehículos eléctricos personal
                  para fomentar la cultura de un buen uso de estos aparatos
                  eléctricos como actores viales, integrando las personas sin
                  distinguir clase social, estrato económico, religioso o
                  étnico, disfrutando la geografía Colombiana en procura de
                  lograr el crecimiento general de los miembros.
                </p>
                <b>
                  <h3>Artículo 2º VISIÓN</h3>
                </b>
                <p>
                  En el año 2026 el Club será reconocido a nivel nacional e
                  internacional como ejemplo de cultura ciudadana, ambiental y
                  social en pro de la movilidad eléctrica.
                </p>
                <b>
                  <h3>Artículo 3º OBJETIVOS DEL CLUB</h3>
                </b>
                <p>
                  1. Afianzar en los miembros y proyectar en la comunidad la
                  filosofía de la conducción segura mediante actividades de
                  sensibilización y capacitación.
                </p>
                <p>
                  2. Crear conciencia del uso ambiental de los vehículos
                  eléctricos personal y promover el respeto al ambiente en los
                  diferentes espacios a visitar.
                </p>
                <p>
                  3. Fomentar el cumplimiento de las normas de tránsito mediante
                  el buen ejemplo en los diferentes espacios de uso de los
                  vehículos eléctricos.
                </p>
                <p>
                  4. Apoyar la labor comercial de nuestros patrocinadores en el
                  mercado como estrategia de colaboración recíproca.
                </p>
                <br />
                <b>
                  <h2 className="flex justify-center">CAPÍTULO II</h2>
                  <h2 className="flex justify-center">DEL INGRESO AL CLUB</h2>
                  <h3>Artículo 4º INGRESO AL CLUB</h3>
                </b>
                <p>
                  1. El Club se reserva el derecho de admisión aplicando las
                  políticas de ingreso.
                </p>
                <p>
                  2. Podrá ingresar cualquier persona por invitación de uno de
                  los miembros o por iniciativa propia.
                </p>
                <p>
                  3. El único canal autorizado para ingresar al club es mediante
                  el WhatsApp No. 3125932772.
                </p>
                <p>
                  4. El interesado deberá presentar una foto suya junto a su
                  vehículo eléctrico personal, copia de la factura de compra;
                  factura que será validada con el vendedor del vehículo.
                </p>
                <p>
                  5. Todo miembro debe estar en disposición de vincularse a las
                  actividades que el Club programe.
                </p>
                <p>
                  6. Quien no figure como propietario en la factura de compra,
                  deberá realizar una declaración juramentada manifestando o la
                  compra de segunda mano del vehículo y/o el uso continuo del
                  vehículo eléctrico personal dentro de su unidad familiar,
                  documento que deberá ser enviado al correo electrónico
                  southelectricscooter@gmail.com
                </p>
                <p>
                  7. Se le compartirá la pagina web del club donde deberá
                  registrarse con sus datos personales, datos que serán tratados
                  de acuerdos a las políticas de tratamiento de datos del club.
                </p>
                <p>
                  8. Una vez se le informe la validación de la factura, se le
                  dará ingreso al aspirante y tendrá 5 minutos para que en un
                  breve párrafo se presente al grupo de WhatsApp, indicando:
                  ocupación, profesión, edad, barrio, tipo de vehículo eléctrico
                  personal, tiempo como usuario de movilidad eléctrica, edad,
                  acompañado de la foto suya junto al vehículo eléctrico
                  personal.
                </p>
                <br />
                <b>
                  <h2 className="flex justify-center">CAPITULO III</h2>
                  <h2 className="flex justify-center">
                    DE LA PERMANENCIA EN EL CLUB
                  </h2>
                  <h3>Artículo 5º DEBERES DE LOS MIEMBROS</h3>
                </b>
                <p>
                  1. Los miembros del Club deberán conocer y respetar las normas
                  de tránsito y seguridad vial en todo momento.
                </p>
                <p>
                  2. Los miembros del Club deben generar un ambiente de
                  cordialidad y de respeto entre los compañeros, por las ideas y
                  opiniones, normas básicas de convivencia, antes, durante y
                  después de las reuniones y en las actividades que programe el
                  Club, así mismo en las conversaciones que se tengan en el
                  grupo de WhatsApp.
                </p>
                <p>
                  3. Los miembros deben confirmar su asistencia e informar
                  anticipadamente de su inasistencia a las personas designadas
                  por el Club cuando de actividades, reuniones, paseos y eventos
                  oficiales programados se trate.
                </p>
                <b>
                  <h3>ARTÍCULO 6º DERECHOS DE LOS MIEMBROS</h3>
                </b>
                <p>
                  1) Todo miembro tiene derecho a postularse a parte de la mesa
                  de trabajo cuando exista la convocatoria.
                </p>
                <p>
                  2) Los miembros aspirantes a algún cargo en la mesa de trabajo
                  deben reunir estos requisitos:
                </p>
                <p>a) Antigüedad mínima de 3 meses dentro del Club.</p>
                <p> b) Puntualidad a las reuniones programadas.</p>
                <p> c) Liderazgo.</p>
                <p> d) Disponibilidad de tiempo.</p>
                <p> e) Contar con vehículo eléctrico.</p>
                <p>
                  f) No tener negocios relacionados con movilidad eléctrica.
                </p>
                <p> g) Firmar el acuerdo de confidencialidad.</p>
                <b>
                  <h3>Artículo 7º PROHIBICIONES</h3>
                </b>
                <p>
                  1) El porte de armas, el consumo de licor y/o sustancias
                  alucinógenas cuando se está conduciendo el vehículo eléctrico
                  personal y en cualquier actividad programada por el Club.
                </p>
                <p>
                  2) Desatender, irrespetar, crear zozobra o pretender dañar la
                  unión y estabilidad del Club.
                </p>
                <b>
                  <h3>Artículo 8º CAUSALES DE EXPULSIÓN</h3>
                </b>
                <p>1. No cumplir con el presente Reglamento.</p>
                <p>
                  2. Actos de irrespeto o agresión a los compañeros y alguna
                  autoridad.
                </p>
                <p>
                  3. Inasistencia constante a las reuniones y/o actividades
                  programadas no demostrando interés por el Club.
                </p>
                <p>4. Consumo de licor en momentos no adecuados. </p>
                <p>5. Portar armas. </p>
                <p>6. Hurtos y robos dentro y fuera del Club. </p>
                <p>
                  7. Desacato reiterativo a las orientaciones dadas por los
                  organizadores de los eventos (salidas, celebraciones,
                  reuniones, etc.) con el ánimo de desestabilizar la unidad del
                  Club.
                </p>
                <p>
                  8. Comentarios mal intencionados y rastreros comprobada su
                  intencionalidad.
                </p>
                <p>9. No contar con vehículo eléctrico personal.</p>
                <p>
                  10. Cualquier acto de irrespeto, acoso, intimidación hacia
                  algún integrante del club.
                </p>
                <br />
                <b>
                  <h2 className="flex justify-center">CAPÍTULO IV</h2>
                  <h2 className="flex justify-center">
                    DE LOS REGLAMENTOS ESPECÍFICOS
                  </h2>
                  <h3>Artículo 9º REGLAMENTO DE SALIDAS</h3>
                </b>
                <p>
                  1. En la reunión previa y en el punto de salida se recordarán
                  las señales de mano o pito, el plan de salida, el orden de
                  cada vehículo eléctrico personal en la caravana, las paradas
                  acordadas y todo lo concerniente al lugar de llegada.
                </p>
                <p>
                  2. En el punto de salida el presidente o su delegado revisará
                  el estado del vehículo eléctrico personal y kit de protección
                  del miembro del club, esta prohibido salir a rodar sin uso de
                  casco como mínimo.
                </p>
                <p>
                  3. El miembro que no cumpla con las condiciones necesarias no
                  puede participar en la salida. vehículo eléctrico personal con
                  batería menor a 15 amperios no podrá participar en salidas
                  largas.
                </p>
                <p>
                  4. Todo miembro debe portar vestimenta adecuada en todo
                  momento; casco homologado, calzado, chaqueta, guantes,
                  impermeable y los distintivos del Club. En caso de lluvia
                  vinipel y portar el chaleco reflectante sobre el impermeable
                  para ser más visibles.
                </p>
                <p>
                  5. Los integrantes del Club deben de ser cordiales con los
                  demás vehículos en circulación, por respeto y cultura,
                  respetaremos las normas de tránsito en todo momento.
                </p>
                <p>
                  6. No se permitirán integrantes en estado de embriaguez en
                  todas sus etapas o bajo los efectos de sustancias
                  alucinógenas, antes o durante la rodada.
                </p>
                <p>
                  7. Se recomienda que todo miembro lleve celular con manos
                  libres, carga y minutos incluidos y dar a conocer el número
                  actualizado.
                </p>
                <p>
                  8. Se programará como cabeza de caravana a la persona con
                  mayor experiencia en rodadas, detrás de este deberá ir la
                  persona que más conozca el destino al que el Club desea
                  llegar, en segundo lugar, los vehículos eléctricos con menor
                  autonomía, en los últimos lugares los vehículos eléctricos de
                  mayor potencia y en la cola de la caravana irá el piloto con
                  mejores conocimientos de mecánica.
                </p>
                <p>
                  9. Nadie debe de adelantar a sus compañeros, ni tampoco
                  continuar la marcha cuando uno de ellos presente problemas en
                  el trayecto. En este caso deberán pitar 3 veces y estacionar a
                  un lado de la vía con todas las medidas de precaución
                  posibles. Se podría realizar un adelantamiento por una
                  necesidad apremiante o una eventualidad mayor.
                </p>
                <p>
                  10. No se permitirán invitados en las salidas, para evitar
                  contratiempos y situaciones riesgosas que alteren en buen
                  ambiente del Club. Éstas salidas se programan con tiempo sólo
                  para miembros con pleno conocimiento de las normas y que hayan
                  sido aceptados como nuevos miembros y hayan cumplido con los
                  requisitos.
                </p>
                <p>
                  11. Cuando se circule en grupo, se hará todo lo posible para
                  no romperlo, es decir los más rápidos y experimentados
                  esperarán y ayudarán a los más lentos, porque el fin del club
                  es la unión de todos sus miembros y el disfrutar con las
                  rutas, y no competir ni llegar lo más rápido al destino, sino
                  disfrutar al máximo hasta llegar a él.
                </p>
                <p>
                  12. Los miembros tendrán claro que el club no se hace cargo de
                  los accidentes, daños o averías que se puedan dar durante las
                  salidas programadas, pero deberán apoyarse entre sí para dar
                  una solución rápida y sobrellevar el percance apropiadamente.
                </p>
                <p>
                  13. Cuando circulemos el respeto entre todos los vehículos
                  eléctricos personal del grupo nunca ha de faltar, siendo
                  recriminado aquella persona que demuestre agresividad con los
                  miembros del grupo o de cualquier persona ajena a este.
                </p>
                <p>
                  14. Se exige buen comportamiento a todos los miembros, para no
                  dejar en mal lugar al club, tanto en las zonas de
                  concentración, mientras circulemos, en los lugares de
                  descanso, etc.
                </p>
                <b>
                  <h3>Artículo 10º REGLAMENTO EN EL GRUPO DE WHATSAPP</h3>
                </b>
                <p>
                  1. Los miembros del Club se comportarán en los mensajes de
                  manera respetuosa, peleas airadas, salidas de tono e insultos
                  no serán permitidos.
                </p>
                <p>
                  2. Se ruega a los miembros escribir de manera correcta y
                  legible.
                </p>
                <p>
                  3. El uso de las MAYÚSCULAS denota un tono alto de voz, así
                  como un GRITO, por favor evite el uso de éstas puesto que es
                  una norma básica para cualquier foro o Chat.
                </p>
                <p>
                  4. Las imágenes publicadas o Stickers como anexos no deben
                  llevar en ningún caso contenido sexual o violento que atente
                  contra los miembros del Club.
                </p>
                <p>
                  5. Los mensajes que se publiquen no deben de llevar publicidad
                  que no sea de interés del objeto del Club, solo se permite
                  promocionar cosas de interés para los miembros del Club tales
                  como: repuestos, componentes de vehículos eléctricos, mejoras
                  a los vehículos eléctricos, servicios todos relacionados con
                  los vehículos eléctricos.
                </p>
                <p>
                  6. Está prohibido publicar cualquier comentario, texto o
                  imagen que promocione actividades ilegales.
                </p>
                <p>
                  7. Los miembros que posteen mensajes son responsables de lo
                  que han escrito y asumen todo tipo de consecuencias de lo
                  escrito, ejemplo difamación a cualquier persona natural o
                  jurídica, se tomaran las acciones legales pertinentes.
                </p>
                <p>
                  8. Los miembros del Club se comprometen a ser personas
                  tolerantes y respetuosas con los demás compañeros que escriban
                  mensajes.
                </p>
                <p>
                  9. Cualquier sugerencia que pueda mejorar el funcionamiento
                  del club será bien recibida.
                </p>
                <p>
                  10. Está prohibido el uso de vocabulario que pueda llegar a
                  incomodar a los demás miembros del club. Ejemplo: “Holi” o
                  coger el grupo de diario o Tinder, esto sin tener relación al
                  objeto del club.
                </p>
                <p>
                  11. Solamente podrán enviar encuestas los integrantes de la
                  mesa de trabajo. Sin embargo, cuando se trate de asuntos
                  académicos estas deben ser autorizadas por la mesa de trabajo.
                </p>
                <p>
                  12. Está prohibido publicar ventas sin previa autorización de
                  los integrantes de la mesa de trabajo.
                </p>
                <p ref={ref}>
                  13. Lo que son marcas o talleres miembros del club no podrán
                  compartir contenido de su actividad comercial sin previo
                  acuerdo con la mesa de trabajo.
                </p>
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
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3 flex justify-center">
              <Button type="submit">{submit}</Button>
            </div>
          </form>
        </Form>
      )}
      {pendingVerification && (
        <OTPInputGroup
          data={form.getValues()}
          verify={verify}
          sentCode={sentCode}
        />
      )}
    </div>
  );
}
