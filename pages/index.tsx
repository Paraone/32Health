import React, { FC, useState } from 'react';

const DEFAULT_COINSURANCE = 'coinsurancePlan';
const DEFAULT_PPO = 'ppoPlan';
const DEFAULT_QUANTITY= 'individual';
const DEFAULT_LENGTH= 'annual';

export interface iData {
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

interface iUserInteraction {
  data: iData,
  lastStep: string
}

const initialData: iData = {
  planName: '',
  coinsurancePlan: DEFAULT_COINSURANCE,
  ppoPlan: DEFAULT_PPO,
  extendedMaximum: '',
  ppoSplitMaximum: '',
  rolloverChecked: '',
  expandingMaximum: '',
  amtMaxAr: '',
  yr1ExpMax: '',
  yr2ExpMax: '',
  extMaxLow: '',
  extMaxHigh: '',
  inAmt: '',
  oonAmt: '',
  rollover: '',
  quantity: DEFAULT_QUANTITY,
  length: DEFAULT_LENGTH,
  startDate: '',
  endDate: ''
};

/*
* postData and getData should be moved into a utils folder
*/

async function postData(url = '', data: iData) {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  window.localStorage.setItem('policy', JSON.stringify(data));
  return response.json();
}

async function getData(url = '') {
  const response = await fetch(url)
  console.log({response})
  const savedData = window.localStorage.getItem('policy') || '';
  if (!savedData) return;
  return JSON.parse(savedData);
}

const Home: FC = () => {
  const [data, setData] = useState<iData>(initialData);
  const [steps, setSteps] = useState<iUserInteraction[]>([{
    data: initialData,
    lastStep: ''
  }]);
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDay() + 20;
  const year = date.getFullYear();
  const currentDate = `${year}-${month}-${day}`;
  const disableSave = steps.length === 1 || steps[steps.length - 1].lastStep.includes('saved data')

  const loadData = async () => {
    const savedData = await getData('/api/policies');
    setData(savedData);
    setSteps([
      ...steps,
    {
      data: savedData,
      lastStep: 'loaded saved data.'
    }]);
  };

  const saveData = async () => {
    const postedData = await postData('api/policies', data);
    console.log({postedData});
    setSteps([
      ...steps,
      {
        data,
        lastStep: 'saved data.'
      }
    ]);
  };

  const inputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, type, name} = e.currentTarget;

    if (type === 'number' && Number(value) < 0) return;
    const newData = { ...data };
    newData[name as keyof iData] = value;
    setData(newData)
  };

  const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.currentTarget;
    const newData = {...data};
    newData[name as keyof iData] = value;
    setData(newData);
  };

  const checkboxOnChange = (e: any) => {
    const { checked, name } = e.currentTarget;
    const newData = { ...data };
    newData[name as keyof iData] = checked ? 'checked' : '';
    setData(newData);
  };

  const logUserInteraction = (e: any) => {
    const { value, name, checked, type, id } = e.currentTarget;
    const lastStep = steps[steps.length - 1];
    const isCheckbox = type === 'checkbox';
    const checkedValue = checked ? 'checked' : '';
    if (lastStep.data[name as keyof iData] !== (isCheckbox ? checkedValue : value)) {
      setSteps([
        ...steps,
        {
          data,
          lastStep: `${steps.length}. Changed ${id} to ${isCheckbox ? checked : value}`
        }
      ]);
    } 
  };

  const undo = () => {
    console.log('undo last step');
    if (steps.length === 1) return
    const newSteps = [...steps];
    newSteps.pop()
    const lastStep = newSteps[newSteps.length - 1];
    setData(lastStep.data);
    setSteps(newSteps);
  };

  return (
    <div className="App">
      <div className="row">
        <button onClick={loadData}>Load</button>
        <input 
          onBlur={logUserInteraction} 
          onChange={inputOnChange} 
          type="text" 
          value={data.planName} 
          name="planName" 
          id="Plan Name"
          placeholder="Type Plan Name Here..." 
          required
        /> 
        <select 
          onBlur={logUserInteraction} 
          onChange={selectOnChange} 
          value={data.coinsurancePlan} 
          id="Coinsurance Plan"
          name="coinsurancePlan"
        >
          <option value="coinsurancePlan">Coinsurance Plan</option>
          <option value="schedulePlan">Schedule plan</option>
          <option value="coplayPlan">Coplay plan</option>
        </select>
        <select 
          onBlur={logUserInteraction} 
          onChange={selectOnChange} 
          value={data.ppoPlan} 
          id="PPO Plan"
          name="ppoPlan"
        >
          <option value="ppoPlan">PPO Plan</option>
          <option value="macPlan">MAC Plan</option>
          <option value="passivePpoPlan">Passive PPO Plan</option>
        </select>
        <button onClick={saveData} disabled={disableSave}>Save</button>
      </div>
      <div className="row dates">
        <span>
          <label htmlFor='startDate'>Start Date</label>
          <input 
            onBlur={logUserInteraction} 
            onChange={inputOnChange} 
            name="startDate" 
            id="Start Date"
            type="date" 
            value={data.startDate} 
            min={currentDate}
            max={data.endDate}
          />
        </span>
        <span>
          <label htmlFor='endDate'>End Date</label>
          <input 
            onBlur={logUserInteraction} 
            onChange={inputOnChange} 
            name="endDate" 
            id="End Date"
            type="date" 
            value={data.endDate} 
            min={data.startDate || currentDate}
          />
        </span>
      </div>
      <div className="row">
        <div className="col">
          <div className='maximums'>Maximums</div>
        </div>
        <div className="col">
          <div className='row'>
            <div className="policy-length">
              <div>
                <input 
                  onBlur={logUserInteraction} 
                  onChange={inputOnChange} 
                  type="radio" 
                  id="Policy Length" 
                  name="length" 
                  value="annual" 
                  checked={data.length === 'annual'}
                />
                <label htmlFor="annual">Annual</label>
              </div>
              <div>
                <input 
                  onBlur={logUserInteraction} 
                  onChange={inputOnChange} 
                  type="radio" 
                  id="Policy Length" 
                  name="length" 
                  value="lifetime" 
                  checked={data.length === 'lifetime'}
                />
                <label htmlFor="lifetime">Lifetime</label>
              </div>
              <input 
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                name="amtMaxAr" 
                id="Amount Max Ar."
                type="number" 
                step="0.01" 
                value={data.amtMaxAr} 
                placeholder="Amt Max Ar." 
              />
            </div>
            <div className="policy-quantity">
              <div>
                <input 
                  onBlur={logUserInteraction} 
                  onChange={inputOnChange} 
                  type="radio" 
                  id="Policy Quantity" 
                  name="quantity" 
                  value="individual" 
                  checked={data.quantity === 'individual'}
                />
                <label htmlFor="individual">Individual</label>
              </div>
              <div>
                <input 
                  onBlur={logUserInteraction} 
                  onChange={inputOnChange} 
                  type="radio" 
                  id="Policy Quantity" 
                  name="quantity" 
                  value="family" 
                  checked={data.quantity === 'family'}
                />
                <label htmlFor="family">Family</label>
              </div>
            </div>
            <div className='rollover'>
              <div>
                <input 
                  type="checkbox" 
                  onBlur={logUserInteraction} 
                  onChange={checkboxOnChange} 
                  id="Rollover" 
                  name="rolloverChecked" 
                  value="value" 
                  checked={!!data.rolloverChecked}
                />
                <label htmlFor="rollover">Rollover</label>
              </div>
              <div className='col'>
                <input 
                  onBlur={logUserInteraction} 
                  onChange={inputOnChange} 
                  type="number" 
                  step="0.01" 
                  name="rollover" 
                  id="Rollover Percentage"
                  value={data.rollover} 
                  placeholder="Rollover %" 
                  disabled={!data.rolloverChecked}
                />
              </div>
            </div>
          </div>
          <div className="expanding-max">
            <div>
              <input 
                type="checkbox" 
                onBlur={logUserInteraction} 
                onChange={checkboxOnChange} 
                id="Expanding Maximum" 
                name="expandingMaximum" 
                value="expanding_maximum" 
                checked={!!data.expandingMaximum}
              />
              <label htmlFor="expanding_maximum">Expanding Maximum</label>
            </div>
            <div className="col">
              <input 
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                name="yr1ExpMax" 
                id="Year 1 Expanding Maximum"
                type="number" 
                step="0.01" 
                value={data.yr1ExpMax} 
                placeholder="Yr1 Exp Max" 
                disabled={!data.expandingMaximum}
              />
              <input 
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                name="yr2ExpMax" 
                id="Year 2 Expanding Maximum"
                type="number" 
                step="0.01" 
                value={data.yr2ExpMax} 
                placeholder="Yr2 Exp Max" 
                disabled={!data.expandingMaximum}
              />
            </div>
          </div>
        </div>
        <div className="col">
          <div className='expanding-max row'>
            <div>
              <input 
                type="checkbox" 
                onBlur={logUserInteraction} 
                onChange={checkboxOnChange} 
                id="Extended Maximum" 
                name="extendedMaximum" 
                value="extended_maximum" 
                checked={!!data.extendedMaximum}
              />
              <label htmlFor="extended_maximum">Extended Maximum</label>
            </div>
            <div className="ext-max-values">
              <span>%</span>
              <input 
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                type="number" 
                step="0.01" 
                value={data.extMaxLow} 
                name="extMaxLow" 
                id="Extended Maximum Low"
                placeholder="Enter" 
                disabled={!data.extendedMaximum}
              />
              <span>Up to</span>
              <input 
                name='extMaxHigh' 
                id="Extended Maximum High"
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                type="number" 
                step="0.01" 
                value={data.extMaxHigh} 
                placeholder="Enter" 
                disabled={!data.extendedMaximum}
              />
            </div>
          </div>
          <div className='col expanding-max'>
            <div>
              <input 
                onBlur={logUserInteraction} 
                onChange={checkboxOnChange} 
                type="checkbox" 
                id="PPO Split Maximum" 
                name="ppoSplitMaximum" 
                value="ppo_split_maximum" 
                checked={!!data.ppoSplitMaximum}
              />
              <label htmlFor="ppo_split_maximum">PPO Split Maximum</label>
            </div>
            <div className='col'>
              <input 
                onBlur={logUserInteraction} 
                onChange={inputOnChange} 
                name="inAmt" 
                id="PPO Split Max IN"
                type="number" 
                step="0.01" 
                value={data.inAmt} 
                placeholder="IN amount" 
                disabled={!data.ppoSplitMaximum}
              />
              <input 
                onBlur={logUserInteraction} 
                id="PPO Split Max OON"
                onChange={inputOnChange} 
                name="oonAmt" 
                type="number" 
                step="0.01" 
                value={data.oonAmt} 
                placeholder="OON amount" 
                disabled={!data.ppoSplitMaximum}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="user-steps">
        {steps.length > 1 &&

          <div className="expanding-max">
            User Steps:
            {
              steps.map(({ lastStep }, index) => {
                return (
                  <div key={index}>
                    <div>{lastStep}</div>
                    {index === steps.length - 1 && !!index && 
                      <button onClick={undo}>Undo Last</button>
                    }
                  </div>
                );
              })
            }
          </div>          
        }
      </div>
    </div>
  );
}

export default Home;
