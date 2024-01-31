import { useTranslations } from "next-intl";
import SignUpForm from "@/components/SignUpForm";

export default function Page() {
  const t = useTranslations("Label");
  return (
    <SignUpForm
      agreeTerms={t("agreeTerms")}
      birthdate={t("birthdate")}
      cellphone={t("cellphone")}
      contactPhone={t("contactPhone")}
      documentNumber={t("documentNumber")}
      documentType={t("documentType")}
      emergencyContact={t("emergencyContact")}
      eps={t("eps")}
      invoice={t("invoice")}
      job={t("job")}
      name={t("name")}
      nickname={t("nickname")}
      rh={t("rh")}
      vehicleBrand={t("vehicleBrand")}
      vehicleType={t("vehicleType")}
    />
  );
}
