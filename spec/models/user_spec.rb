require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) {FactoryGirl.create(:user)}

  it "does not save user without a name" do
    user.name = nil
    user.valid?
    expect(user.errors[:name].size).to eq(1)
  end

  it "does assign support role to user" do
    user.assign_role(:support)
    expect(user.support).to eq(true)
  end

  it "does assign admin role to user" do
    user.assign_role(:admin)
    expect(user.admin).to eq(true)
  end

  it "does deny support role to user" do
    user = FactoryGirl.create(:support)
    user.deny_role(:support)
    expect(user.support).to eq(false)
  end

  it "does deny admin role to user" do
    user = FactoryGirl.create(:admin)
    user.deny_role(:admin)
    expect(user.admin).to eq(false)
  end

end