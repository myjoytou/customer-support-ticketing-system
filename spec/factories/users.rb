require 'factory_girl'


FactoryGirl.define do
  factory :user, :class => WorkFlow::User  do
    # name {Faker::Name.name }
    email {name.downcase.gsub(/[.\ ]*/, "") + "@gmail.com" }
    password {"123456"}
    password_confirmation {"123456"}
  end
end