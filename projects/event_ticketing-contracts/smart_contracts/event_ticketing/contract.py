from algopy import ARC4Contract, String, UInt64
from algopy.arc4 import abimethod


class EventTicketing(ARC4Contract):
    
    event_name: String
    event_date: String
    event_time: String
    event_location: String
    ticket_price: UInt64
    total_tickets: UInt64
    tickets_sold: UInt64

    @abimethod()
    def create_event(self, name: String, date: String, time: String, location: String, price: UInt64, total: UInt64) -> None:
        assert name != "", "Event name cannot be empty"
        assert date != "", "Event date cannot be empty"
        assert time != "", "Event time cannot be empty"
        assert location != "", "Event location cannot be empty"
        assert price > UInt64(0), "Price must be greater than zero"
        assert total > UInt64(0), "Total tickets must be greater than zero"

        self.event_name = name
        self.event_date = date
        self.event_time = time
        self.event_location = location
        self.ticket_price = price
        self.total_tickets = total
        self.tickets_sold = UInt64(0)


    @abimethod()
    def mint_ticket(self) -> None:
        #assert self.tickets_sold < self.total_tickets, "All tickets have been sold"
        self.tickets_sold += UInt64(1)

    @abimethod()
    def hello(self, name: String) -> String:
        return "Hello, " + name
