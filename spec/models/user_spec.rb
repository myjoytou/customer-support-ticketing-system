require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) {FactoryGirl.create(:user)}

  it "does not save user without a name" do
    user.name = nil
    user.valid?
    expect(user.errors[:name].size).to eq(1)
  end
end