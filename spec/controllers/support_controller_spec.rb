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

  it "does return status as success when user is support" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:support)
    get "get_pending_tickets", format: :json
    puts "========Success============= #{response.body}"
    expect(response.status).to eq(200)
  end

  it "does process pending tickets" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:support)
    FactoryGirl.create(:closed_ticket, user_id: user.id)
    post "process_pending_tickets", { params: {ticket_id: ticket.id, status: "Closed"} , format: :json}
    puts "========Success============= #{response.body}"
    expect(response.status).to eq(201)
  end

  it "does return error if there are no closed tickets in one month" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:support)
    get "get_closed_tickets", format: :pdf
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(401)
  end

  it "does get the pdf of closed tickets of one month" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    puts "============== the user is #{user.id}"
    FactoryGirl.create(:closed_ticket_with_user, user: support)
    sign_in support
    get "get_closed_tickets", format: :pdf
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(200)
  end

end