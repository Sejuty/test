import React, { useState, useRef } from 'react';
// import logo from './logo.svg';
import './App.css';
import './assets/styles/allspark.css';
/*
import { SCCheckbox } from './components/Checkbox';
import { SCModal, SCModalHeader, SCModalBody } from './components/Modal';
*/
import {
  SCButton,
  SCDatepicker,
  // SCDatepicker,
  // SCDatepickerOld,
  SCInput,
  SCSelectV3,
  SCTimepicker,
  SCModal,
  SCModalBody,
  SCModalHeader,
  SCSwitch,
  SCSelect, SCTooltip,
} from './components';

function App() {
  const modalRef = useRef(null);
  const testModalRef = useRef(null);
  const [itemInStock, setItemInStock] = useState(true);
  const [selectedSource, setSelectedSource] = useState(null);
  const [sources, setSources] = useState([{
    "id": 1,
    "name": "In-store",
    "image": "",
    "sources": [
      {
        "id": 6,
        "name": "In-store",
        "image": ""
      }
    ]
  },
  {
    "id": 2,
    "name": "Own Channels",
    "image": "",
    "sources": [
      {
        "id": 7,
        "name": "Call",
        "image": ""
      },
      {
        "id": 8,
        "name": "Website",
        "image": ""
      }
    ]
  }]);
  
  const handleSelect = val => setSelectedSource(val);

  const [value, setValue] = useState('');

  const updateOrderModalHeader = (
    <SCModalHeader closeButtonPosition='right'>Saif raihan</SCModalHeader>
  );

  const updateOrderModalBody = (
    <SCModalBody>
      <div className='flex justify-end'>
        Hello
        <SCButton variant='danger' size='lg'>
          No
        </SCButton>
      </div>
    </SCModalBody>
  );

  const handleTestSubmit = () => {
    console.log('Test Submit');
  };

  const modalBody = (
    <SCModalBody>
      <div className='mb-5'>
        <form onSubmit={handleTestSubmit}>
          <SCInput
            id='username'
            label='Email'
            placeholder='Type your email here'
            inputClass='border-b-2 border-x-0 border-t-0 border-px-0'
            className='mb-12'
            hint='Please use the email you signed up with'
            value={value}
            handleChange={e => setValue(e.target.value)}
          />
          <SCButton variant='primary-outline'>Submit</SCButton>
        </form>
      </div>
    </SCModalBody>
  );

  const modalHeader = (
    <SCModalHeader closeButtonPosition='right'>Test Menu</SCModalHeader>
  );

  const handleShowModal = () => {
    testModalRef.current.showModal();
  };

  const selectTitle = (
    <div className="flex">
      <div className="text-grey-darker font-bold">Hello World</div>
      <div className="text-red">*</div>
    </div>
  );

  return (
    <div className='App h-screen flex flex-col'>
      <SCModal
        variant='white'
        header={updateOrderModalHeader}
        body={updateOrderModalBody}
        ref={modalRef}
      />
      <SCModal
        ref={testModalRef}
        variant='white'
        header={modalHeader}
        body={modalBody}
      />

      <SCSelectV3
        options={sources}
        value={selectedSource}
        groupSelect={true}
        groupLabel="name"
        groupValues="sources"
        trackBy="id"
        label="name"
        title={selectTitle}
        onSelect={val => handleSelect(val)}
        placeholder='Select Source'
      />

      <div className="flex">
        <SCButton
          action={() => setSources([
            {
              "id": 1,
              "name": "In-store",
              "image": "",
              "sources": [
                {
                  "id": 6,
                  "name": "In-store",
                  "image": ""
                }
              ]
            },
            {
              "id": 2,
              "name": "Own Channels",
              "image": "",
              "sources": [
                {
                  "id": 7,
                  "name": "Call",
                  "image": ""
                },
                {
                  "id": 8,
                  "name": "Website",
                  "image": ""
                }
              ]
            },
            {
              "id": 3,
              "name": "Messaging sites",
              "image": "",
              "sources": [
                {
                  "id": 9,
                  "name": "Messenger",
                  "image": ""
                },
                {
                  "id": 10,
                  "name": "Viber",
                  "image": ""
                },
                {
                  "id": 11,
                  "name": "Whatsapp",
                  "image": ""
                }
              ]
            },
            {
              "id": 4,
              "name": "Social media",
              "image": "",
              "sources": [
                {
                  "id": 12,
                  "name": "Facebook",
                  "image": ""
                },
                {
                  "id": 13,
                  "name": "Instagram",
                  "image": ""
                },
                {
                  "id": 14,
                  "name": "Tiktok",
                  "image": ""
                }
              ]
            },
          ])}
          label={'Set Source List'}
          className="mt-2 mr-4"
        />

        <SCButton
          action={() => setSelectedSource({
            "id": 7,
            "name": "Call",
            "image": ""
          })}
          label={'Set Source'}
          className="mt-2 mr-4"
        />
      </div>
      

      <SCTooltip
        // content=""
        position='right'
        content={`${
          // eslint-disable-next-line no-nested-ternary
          itemInStock
            ? 'Disable stock'
            : 'Enable Stock'
        }`}
      >

        <div
        >
          <SCSwitch
            className={``}
            value={itemInStock}
            // disabledMessage="Parent sub-menu is disabled, so you can't alter the state of this item."
            // disabledTooltipId="item-disabled-tooltip"
            handleChange={() => {
              setItemInStock(!itemInStock);
            }}
          />
        </div>
      </SCTooltip>

      <SCSelect
        options={[
          { id: 1, name: 'Suzuki' },
          { id: 2, name: 'Yamaha' },
          { id: 3, name: 'Kawasaki' },
          { id: 4, name: 'Honda' },
        ]}
        trackBy='id'
        label='name'
        disableSelectedItem
      />
      <SCButton variant='primary-outline' action={handleShowModal}>
        Show Test Modal
      </SCButton>
      <div className='w-1/4'>
        <SCButton size='lg' label='click me' />
        <div className='flex flex-row gap-2'>
          <SCTimepicker
            // value={endTime}
            minuteStep={1}
            minuteStart={1}
            // handleChange={handleChangeClosingTime}
          />
        </div>
      </div>
      <br />
      <div className='w-1/4 bg-blue'>
        <SCDatepicker
          className='mr-4 mt-4 mb-4'
          title='Select Date Range with button'
          helpText={'Select range'}
          elementType={'button'}
          placeholder={'Select a date'}
          isClearable={false}
          selectsRange={true}
          startDate={'26/05/2022'}
          endDate={'27/05/2022'}
          dateFormat={'dd/MM/yyyy'}
        />
      </div>
    </div>
  );
}

export default App;
