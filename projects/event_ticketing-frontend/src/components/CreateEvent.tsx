import React, { useState } from 'react';
import { EventTicketingClient } from '../contracts/EventTicketing';
import { AlgorandClient } from '@algorandfoundation/algokit-utils';
import { getAlgodConfigFromViteEnvironment, getAppId, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';
import { useWallet } from '@txnlab/use-wallet-react';

interface CreateEventInterface {
  openModal: boolean
  closeModal: () => void
}

const CreateEvent = ({ openModal, closeModal }: CreateEventInterface) => {

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })

  const { transactionSigner, activeAddress } = useWallet()

  algorand.setDefaultSigner(transactionSigner)

  const appId = getAppId().appId;

  const eventTicketingClient = new EventTicketingClient({
    appId: appId,
    algorand,
    defaultSender: activeAddress ?? undefined,
  });

  const handleCloseModal = async () => {
    closeModal();
    setName("");
    setDate("");
    setTime("");
    setLocation("");
    setPrice(0);
    setTotal(0);
  }

  const handleCreateEvent = async () => {
    try {
      const txn = await eventTicketingClient.send.createEvent({
        args: [name, date, time, location, price, total]
      });
      console.log("Event created successfully:", txn);
      closeModal();
      setName("");
      setDate("");
      setTime("");
      setLocation("");
      setPrice(0);
      setTotal(0);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event: " + error);
    }
  }

  const handleMintTicket = async () => {
    try {
      const txn = await eventTicketingClient.send.mintTicket({
        sender: activeAddress!,
        args: []
      });
      console.log("NFT minted:", txn);
      alert("NFT ticket minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT: " + error);
    }
  };

  if (!openModal) return null;

  return (
    <dialog
      id="create_event_modal"
      className={`modal ${openModal ? 'modal-open' : ''}`}
      style={{ display: openModal ? 'block' : 'none' }}
    >
      <form method="dialog" className="modal-box">
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <div className="grid gap-4">
          <label htmlFor="name-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Event Name</label>
          <input id="name-input" placeholder="Name" className="w-full" value={name} onChange={e => setName(e.target.value)} />
          <label htmlFor="date-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Date</label>
          <input id="date-input" type='date' placeholder="Date" className="w-full" value={date} onChange={e => setDate(e.target.value)} />
          <label htmlFor="time-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Time</label>
          <input id="time-input" type='time' placeholder="Time" className="w-full" value={time} onChange={e => setTime(e.target.value)} />
          <label htmlFor="location-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Location</label>
          <input id="location-input" placeholder="Location" className="w-full" value={location} onChange={e => setLocation(e.target.value)} />
          <label htmlFor="price-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Price</label>
          <input id="price-input" placeholder="Price" className="w-full" value={price} onChange={e => setPrice(Number(e.target.value))} />
          <label htmlFor="total-input" style={{ textAlign: 'left' }} className="text-sm text-gray-500">Total Tickets</label>
          <input id="total-input" placeholder="Total Tickets" className="w-full" value={total} onChange={e => setTotal(Number(e.target.value))} />
        </div>

        <div className="modal-action flex flex-col gap-2">
          <button className="btn w-full" onClick={handleCloseModal}>Cancel</button>
          <button className="btn btn-primary w-full" onClick={handleCreateEvent}>Create</button>
          <button type="button" className="btn w-full" onClick={handleMintTicket}>Mint NFT Ticket</button>
        </div>
      </form>
    </dialog >
  )
}
export default CreateEvent
