export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between p-1">
      <iframe
        src="https://app.sab.gov.co/sab/lluvias.htm"
        style={{ width: "100%", height: "34vw", maxWidth: "800px" }}
      ></iframe>
    </main>
  );
}
