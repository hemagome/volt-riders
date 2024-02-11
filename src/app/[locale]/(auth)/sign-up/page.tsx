import { useTranslations } from "next-intl";
import SignUpForm from "@/components/SignUpForm";

export default function Page() {
  const t = useTranslations("SignUp");

  return (
    <SignUpForm
      agreeTerms={t("agreeTerms")}
      birthdate={t("birthdate")}
      cellphone={t("cellphone")}
      confirmPassword={t("confirmPassword")}
      documentNumber={t("documentNumber")}
      documentType={t("documentType")}
      dragDrop={t("dragDrop")}
      emergencyContact={t("emergencyContact")}
      eps={t("eps")}
      female={t("female")}
      firstName={t("firstName")}
      fullName={t("fullName")}
      gender={t("gender")}
      invoice={t("invoice")}
      invoiceAdvice={t("invoiceAdvice")}
      invoiceDescription={t("invoiceDescription")}
      lastName={t("lastName")}
      mail={t("mail")}
      male={t("male")}
      nonBinary={t("nonBinary")}
      password={t("password")}
      personalData={t("personalData")}
      relationship={t("relationship")}
      rh={t("rh")}
      selectDate={t("selectDate")}
      selectEps={t("selectEps")}
      sentCode={t("sentCode")}
      submit={t("submit")}
      terms={t("terms")}
      vehicleBrand={t("vehicleBrand")}
      vehicleData={t("vehicleData")}
      vehicleType={t("vehicleType")}
      verify={t("verify")}
    />
  );
}
