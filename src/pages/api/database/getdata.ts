import prisma from "@/lib/prisma";

export default async function handle(res: {
  json: (arg0: { id: number; accessData: Date }) => void;
}) {
  var year = new Date().getFullYear();
  const month = new Date().getMonth();
  if (month < 4) {
    year - 1;
  }
  const result = await prisma.accessHistory.create({
    data: {
      accessDate: new Date(),
    },
  });
  res.json(result);
}
