// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { iData } from '../index';

type Data = iData

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
