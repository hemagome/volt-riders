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
      contactPhone={t("contactPhone")}
      documentNumber={t("documentNumber")}
      documentType={t("documentType")}
      dragDrop={t("dragDrop")}
      emergencyContact={t("emergencyContact")}
      eps={t("eps")}
      howKnowUs={t("howKnowUs")}
      invoice={t("invoice")}
      invoiceDescription={t("invoiceDescription")}
      job={t("job")}
      name={t("name")}
      nickname={t("nickname")}
      nicknameDescription={t("nicknameDescription")}
      referMessage={t("referMessage")}
      rh={t("rh")}
      selectDate={t("selectDate")}
      selectEps={t("selectEps")}
      submit={t("submit")}
      vehicleBrand={t("vehicleBrand")}
      vehicleType={t("vehicleType")}
    />
  );
}
