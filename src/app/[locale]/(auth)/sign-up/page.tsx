import { useTranslations } from "next-intl";
import SignUpForm from "@/components/SignUpForm";

export default function Page() {
  const t = useTranslations("SignUp");

  return (
    <SignUpForm
      aboutYou={t("aboutYou")}
      agreeTerms={t("agreeTerms")}
      birthdate={t("birthdate")}
      cellphone={t("cellphone")}
      documentNumber={t("documentNumber")}
      documentType={t("documentType")}
      dragDrop={t("dragDrop")}
      emergencyContact={t("emergencyContact")}
      eps={t("eps")}
      female={t("female")}
      gender={t("gender")}
      howKnowUs={t("howKnowUs")}
      invoice={t("invoice")}
      invoiceAdvice={t("invoiceAdvice")}
      invoiceDescription={t("invoiceDescription")}
      job={t("job")}
      male={t("male")}
      name={t("name")}
      nickname={t("nickname")}
      nicknameDescription={t("nicknameDescription")}
      nonBinary={t("nonBinary")}
      optionalData={t("optionalData")}
      personalData={t("personalData")}
      referMessage={t("referMessage")}
      relationship={t("relationship")}
      rh={t("rh")}
      selectDate={t("selectDate")}
      selectEps={t("selectEps")}
      submit={t("submit")}
      terms={t("terms")}
      vehicleBrand={t("vehicleBrand")}
      vehicleData={t("vehicleData")}
      vehicleType={t("vehicleType")}
    />
  );
}
