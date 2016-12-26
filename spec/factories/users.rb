require 'factory_girl'


FactoryGirl.define do
  factory :user  do
    name {Faker::Name.name }
    email {name.downcase.gsub(/[.\ ]*/, "") + "@gmail.com" }
    password {"123456"}
    password_confirmation {"123456"}

    trait :with_support_role do
      after :create do |user|
        user.support = true
        user.save!
      end
    end

    trait :with_inactive_status do
      after :create do |user|
        user.is_active = false
        user.save!
      end
    end

    factory :support, traits: [:with_support_role]
    factory :inactive_user, traits: [:with_inactive_status]
  end
end