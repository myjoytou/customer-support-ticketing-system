require 'rails_helper'

RSpec.describe CustomerController, type: :controller do
  let(:user) {FactoryGirl.create(:user)}

  it "does not allow to access data without signin" do
    get "get_previous_tickets", format: :json
    expect(response.status).to eq(401)
    puts "================ #{response.body}"
  end

  it "does return status as Success when trying to create ticket" do
    @request.env["devise.mapping"] = Devise.mappings[:user]
    sign_in FactoryGirl.create(:user)
    post "create_new_ticket",{params: {name: 'something'} ,format: :json}
    expect(response.status).to eq(201)
    puts "=========success======= #{response.body}"
  end

end