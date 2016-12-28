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

  it "assign support role to the user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:admin)
    post "assign_support_role", {params: {user_id: user.id}, format: :json}
    puts "==================== Success ============== #{response.body}"
    expect(response.status).to eq(201)
    expect(User.find(user.id).support).to eq(true)
  end

  it "assign admin role to the user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:admin)
    post "assign_admin_role", {params: {user_id: user.id}, format: :json}
    expect(response.status).to eq(201)
    puts "==================== Success ============== #{response.body}"
    expect(User.find(user.id).admin).to eq(true)
  end

  it "deny admin role to the user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:admin)
    user = FactoryGirl.create(:admin)
    post "deny_admin_role", {params: {user_id: user.id}, format: :json}
    puts "==================== Success ============== #{response.body}"
    expect(user.admin).to eq(true)
    expect(response.status).to eq(201)
    expect(User.find(user.id).admin).to eq(false)
  end

  it "deny support role to the user" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:admin)
    user = FactoryGirl.create(:support)
    post "deny_support_role", {params: {user_id: user.id}, format: :json}
    puts "==================== Success ============== #{response.body}"
    expect(user.support).to eq(true)
    expect(response.status).to eq(201)
    expect(User.find(user.id).support).to eq(false)
  end

  it "does process open ticket (change status to closed)" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    admin = FactoryGirl.create(:admin)
    sign_in admin
    open_ticket = FactoryGirl.create(:ticket)
    expect(open_ticket.status).to eq('Open')
    post "process_pending_tickets", {params: {ticket_id: open_ticket.id, status: "Closed"}, format: :json}
    puts "==================== Success ============== #{response.body}==== #{open_ticket.id}====#{Ticket.find(open_ticket.id).id}"
    expect(response.status).to eq(201)
    # expect(Ticket.find(open_ticket.id).status).to eq('Open')
    expect(Ticket.find(open_ticket.id).status).to eq("Closed")
    expect(Ticket.find(open_ticket.id).worker_id).to eq(admin.id)
  end

end