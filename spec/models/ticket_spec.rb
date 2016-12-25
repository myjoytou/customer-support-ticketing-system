require "rails_helper"

RSpec.describe Ticket, type: :model do
  it "does not save without name" do
    tic = Ticket.new
    expect(tic.save).to eq(false)
  end
end