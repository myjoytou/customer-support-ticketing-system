require 'rails_helper'

RSpec.describe AdminController, type: :controller do
  let(:admin) {FactoryGirl.create(:admin)}
  let(:user) { FactoryGirl.create(:user) }

  it "does not allow to access data without signin" do
    get "get_all_users", format: :json
    expect(response.status).to eq(401)
    puts "================ #{response.body}"
  end

  it "does not allow access when user is not admin" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:user)
    get "get_all_users", format: :json
    puts "=========success======= #{response.body}"
    expect(response.status).to eq(401)
  end

  it "does get all users when user is admin" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in admin
    get "get_all_users", format: :json
    puts "=========success======= #{response.body}"
    expect(response.status).to eq(200)
  end

  it "does deactivate the given user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in admin
    user = FactoryGirl.create(:user)
    post "deactivate_user", {params: {user_id: user.id}, format: :json}
    puts "=============== success===========#{response.body}"
    expect(User.find(user.id).is_active).to eq(false)
    expect(response.status).to eq(201)
  end

  it "does activate the given user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in admin
    user = FactoryGirl.create(:inactive_user)
    post "activate_user", {params: {user_id: user.id}, format: :json}
    puts "=============== success===========#{response.body}"
    expect(User.find(user.id).is_active).to eq(true)
    expect(response.status).to eq(201)
  end

  it "does get all the pending tickets" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in admin
    FactoryGirl.create(:ticket)
    get "get_pending_tickets", format: :json
    puts "=============== success===========#{JSON.parse(response.body)}"
    expect(response.status).to eq(200)
    expect(JSON.parse(response.body)["data"].count).to eq(Ticket.open_tickets.count)
  end

  it "does get all the closed tickets" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in admin
    FactoryGirl.create(:closed_ticket)
    get "get_closed_tickets", format: :json
    puts "=============== success===========#{JSON.parse(response.body)}"
    expect(response.status).to eq(200)
    expect(JSON.parse(response.body)["data"].count).to eq(Ticket.closed_tickets.count)
  end

  it "does get the pdf of closed tickets of one month" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    FactoryGirl.create(:closed_ticket_with_user, user: user)
    sign_in FactoryGirl.create(:admin)
    get "get_closed_tickets_report", format: :pdf
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(200)
  end

end