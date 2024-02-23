import { PrismaClient, Prize } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Prize>
) {
  console.log(req.method);
  if (req.method === 'GET') {
    const prize = await prisma.prize.findFirst({});
    console.log(prize);
    if (!prize) {
      const response = await prisma.prize.create({
        data: {
          amount: 0.03,
        },
      });

      return res.status(200).json(response);
    }

    return res.status(200).json(prize);
  }

  if (req.method === 'PUT') {
    const { amount } = req.body;
    const prize = await prisma.prize.findFirst({});
    if (!prize) {
      const response = await prisma.prize.create({
        data: {
          amount,
        },
      });

      return res.status(200).json(response);
    }
    const response = await prisma.prize.update({
      where: {
        id: prize.id,
      },
      data: {
        amount,
      },
    });

    return res.status(200).json(response);
  }
}
