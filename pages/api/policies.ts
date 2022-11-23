// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  planName: string,
  coinsurancePlan: string,
  ppoPlan: string,
  extendedMaximum: string,
  ppoSplitMaximum: string,
  rolloverChecked: string,
  expandingMaximum: string,
  amtMaxAr: string,
  yr1ExpMax: string,
  yr2ExpMax: string,
  extMaxLow: string,
  extMaxHigh: string,
  inAmt: string,
  oonAmt: string,
  rollover: string,
  quantity: string,
  length: string,
  startDate: string,
  endDate: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;

  if (method?.toUpperCase() === "POST") {
    console.log('saving data to endpoint', { data: body });
    res.status(200).json(body);
  }

  if (method?.toUpperCase() === "GET") {
    console.log('retrieving saved data');
    const savedData = {"planName":"My plan","coinsurancePlan":"coinsurancePlan","ppoPlan":"ppoPlan","extendedMaximum":"checked","ppoSplitMaximum":"checked","rolloverChecked":"checked","expandingMaximum":"checked","amtMaxAr":"123","yr1ExpMax":"123","yr2ExpMax":"123","extMaxLow":"123","extMaxHigh":"123","inAmt":"123","oonAmt":"123","rollover":"123","quantity":"individual","length":"annual","startDate":"2022-11-24","endDate":"2022-11-30"}
    res.status(200).json(savedData);
  }
}
