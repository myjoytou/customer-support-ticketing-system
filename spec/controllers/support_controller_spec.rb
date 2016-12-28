require 'rails_helper'

RSpec.describe SupportController, type: :controller do
  let(:user) {FactoryGirl.create(:user)}
  let(:ticket) {FactoryGirl.create(:ticket)}
  let(:support) {FactoryGirl.create(:support)}

  it "does not allow user to access data without signin" do
    get "get_pending_tickets", format: :json
    expect(response.status).to eq(401)
    puts "===================== #{response.body}"
  end

  it "does not allow normal user to access data" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:user)
    get "get_pending_tickets", format: :json
    expect(response.status).to eq(401)
    puts "========Failure============= #{response.body}"
  end

  it "does return pending tickets when user is support" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:support)
    get "get_pending_tickets", format: :json
    puts "========Success============= #{response.body}"
    expect(response.status).to eq(200)
    expect(JSON.parse(response.body)["data"].count).to eq(Ticket.open_tickets.where(worker_id: nil).count)
  end

  it "does process pending tickets" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:support)
    FactoryGirl.create(:closed_ticket, user_id: user.id)
    post "process_pending_tickets", { params: {ticket_id: ticket.id, status: "Closed"} , format: :json}
    puts "========Success============= #{response.body}"
    expect(response.status).to eq(201)
  end

  it "does return error if there are no closed tickets in one month for that user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    support = FactoryGirl.create(:support)
    support.tickets = []
    sign_in support
    get "get_closed_tickets_report", format: :pdf
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(401)
  end

  it "does get the pdf of closed tickets of one month" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    ticket = FactoryGirl.create(:closed_ticket_with_worker, user: support)
    puts "============== the user is #{support.id} and ticket is: #{ticket.worker_id}"
    sign_in support
    get "get_closed_tickets_report", format: :pdf
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(200)
  end

end