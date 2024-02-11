import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

interface Vehicle {
  file: any;
  vehicleType: string;
  brand: string;
  url: string;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    let vehiclesTable = "<ul>";
    data.vehicles.forEach((vehicle: Vehicle) => {
      let vehicleType = "";
      if (vehicle.vehicleType === "1") {
        vehicleType = "Patineta";
      } else if (vehicle.vehicleType === "2") {
        vehicleType = "Rueda";
      }
      vehiclesTable += `
        <tr>
          <td>${vehicleType}</td>
          <td>${vehicle.brand}</td>
          <td><a href="${vehicle.url}">Factura</a></td>
        </tr>`;
    });
    vehiclesTable += "</ul>";

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: "southelectricscooter@gmail.com",
      subject: "Nuevo usuario registrado",
      html: `<ul>
              <li>Nombres: ${data.firstName}</li>
              <li>Apellidos: ${data.lastName}</li>
              <li>Fecha de nacimiento: ${data.birthdate}</li>
              <li>Tipo de documento: ${data.documentType}</li>
              <li>Número de documento: ${data.documentNumber}</li>
              <li>Teléfono: ${data.phone}</li>
              <li>Nombre de contacto: ${data.contactName}</li>
              <li>Teléfono de contacto: ${data.contactPhone}</li>
              <li>Vehículos:
                <table border="1">
                  <thead>
                    <tr>
                      <th>Tipo de vehículo</th>
                      <th>Marca</th>
                      <th>URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${vehiclesTable}
                  </tbody>
                </table>
              </li>
            </ul>`,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(`Error: ${error}`, { status: 500 });
  }
  return new NextResponse("", { status: 200 });
}
