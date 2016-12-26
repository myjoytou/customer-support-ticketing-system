require "rails_helper"

RSpec.describe Ticket, type: :model do
  let(:user) {FactoryGirl.create(:user)}
  let(:ticket) {FactoryGirl.create(:ticket)}

  it "does not save without name" do
    tic = Ticket.new
    expect(tic.save).to eq(false)
  end

  it "does not save without user_id" do
    tic = Ticket.new
    tic.name = "First"
    tic.status = "Open"
    tic.short_description = "Something short"
    tic.long_description = "something long"
    expect(tic.save).to eq(false)
  end

  it "does not save without status" do
    tic = Ticket.new
    tic.name = "First"
    tic.user_id = 4
    tic.short_description = "Something short"
    tic.long_description = "something long"
    expect(tic.save).to eq(false)
  end

  it "does return true after creating a ticket" do
    params = {
        name: "Second",
        short_description: "Something short",
        long_description: "Something long",
    }
    puts "user is : #{user.id}"
    expect(Ticket.create_support_ticket(params, user)).to eq(true)
  end

  it "does change the status of the ticket" do
    ticket.process_ticket("Closed")
    expect(ticket.status).to eq("Closed")
  end

end