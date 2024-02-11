import { Button } from "./ui/button";
import { FormSchema } from "./SignUpForm";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter } from "@/navigation";
import { useSignUp } from "@clerk/nextjs";
import { SyntheticEvent, useState } from "react";
import { z } from "zod";

interface InputValues {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
  input6: string;
}

interface OTPInputGroupProps {
  data: z.infer<typeof FormSchema>;
  verify: string;
  sentCode: string;
}

const OTPInputGroup: React.FC<OTPInputGroupProps> = ({
  data,
  verify,
  sentCode,
}) => {
  const { edgestore } = useEdgeStore();
  const [inputValues, setInputValues] = useState<InputValues>({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const handleInputChange = (inputId: keyof InputValues, value: string) => {
    if (/^\d*$/.test(value)) {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [inputId]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: Object.values(inputValues).join(""),
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await Promise.all([
          Promise.all(
            data.vehicles.map((vehicle) =>
              edgestore.publicFiles.confirmUpload({ url: vehicle.url }),
            ),
          ),
          fetch("/api/mail/review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: data.firstName,
              lastName: data.lastName,
              documentNumber: data.documentNumber,
              phone: data.phone,
              contactPhone: data.contactPhone,
              contactName: data.contactName,
              rh: data.rh,
              birthdate: data.birthdate.toISOString().split("T")[0],
              documentType: data.documentType,
              vehicles: data.vehicles,
            }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(
                "Error al enviar el formulario por correo electrónico",
              );
            }
          }),
        ]);
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  const allInputsFilled = () => {
    return Object.values(inputValues).every((value) => value !== "");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Label className="flex items-center justify-center">
          {sentCode + data.mail.split("@")[1]}
        </Label>
        <div
          data-autosubmit="true"
          className="md:grid md:grid-cols-6 md:gap-6 py-8 space-y-6 md:space-y-0"
        >
          <OTPInput
            id="input1"
            value={inputValues.input1}
            onValueChange={handleInputChange}
            previousId={null}
            handleSubmit={handleSubmit}
            nextId="input2"
          />
          <OTPInput
            id="input2"
            value={inputValues.input2}
            onValueChange={handleInputChange}
            previousId="input1"
            handleSubmit={handleSubmit}
            nextId="input3"
          />
          <OTPInput
            id="input3"
            value={inputValues.input3}
            onValueChange={handleInputChange}
            previousId="input2"
            handleSubmit={handleSubmit}
            nextId="input4"
          />
          <OTPInput
            id="input4"
            value={inputValues.input4}
            onValueChange={handleInputChange}
            previousId="input3"
            handleSubmit={handleSubmit}
            nextId="input5"
          />
          <OTPInput
            id="input5"
            value={inputValues.input5}
            onValueChange={handleInputChange}
            previousId="input4"
            handleSubmit={handleSubmit}
            nextId="input6"
          />
          <OTPInput
            id="input6"
            value={inputValues.input6}
            onValueChange={handleInputChange}
            previousId="input5"
            handleSubmit={handleSubmit}
            nextId={null}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={!allInputsFilled()}>
            {verify}
          </Button>
        </div>
      </form>
    </>
  );
};

interface OTPInputProps {
  id: keyof InputValues;
  previousId: keyof InputValues | null;
  nextId: keyof InputValues | null;
  value: string;
  onValueChange: (inputId: keyof InputValues, value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({
  id,
  previousId,
  nextId,
  value,
  onValueChange,
  handleSubmit,
}) => {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === "Backspace" || key === "ArrowLeft") {
      const prev = document.getElementById(
        previousId || "",
      ) as HTMLInputElement;
      if (prev) {
        prev.select();
      }
    } else if (
      (key >= "0" && key <= "9") || // Teclas numéricas
      (key >= "A" && key <= "Z") || // Teclas alfabéticas
      key === "ArrowRight" // Tecla de flecha derecha
    ) {
      const next = document.getElementById(nextId || "") as HTMLInputElement;
      if (next) {
        next.select();
      } else {
        const inputGroup: HTMLFormElement | null = document.getElementById(
          "OTPInputGroup",
        ) as HTMLFormElement | null;
        if (inputGroup && inputGroup.dataset.autosubmit === "true") {
          const fakeEvent: SyntheticEvent<HTMLFormElement> = {
            preventDefault: () => {},
            currentTarget: inputGroup,
            target: inputGroup,
            nativeEvent: {} as Event,
            bubbles: false,
            cancelable: false,
            defaultPrevented: false,
            isTrusted: false,
            timeStamp: 0,
            type: "fake",
            eventPhase: 0,
            isDefaultPrevented: () => false,
            isPropagationStopped: () => false,
            persist: () => {},
            stopPropagation: () => {},
          };
          handleSubmit(fakeEvent);
        }
      }
    }
  };
  return (
    <Input
      id={id}
      name={id}
      type="text"
      value={value}
      maxLength={1}
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        onValueChange(id as keyof InputValues, target.value);
      }}
      onKeyUp={handleKeyUp}
      className="w-16 h-16 text-4xl text-center focus:border-transparent"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
};

export default OTPInputGroup;
