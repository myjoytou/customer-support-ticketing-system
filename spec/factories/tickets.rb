require 'factory_girl'


FactoryGirl.define do
  factory :ticket  do
    ignore do
      user nil
    end
    name {Faker::Name.name }
    short_description { Faker::Lorem.words(rand(10)+1).join(" ") }
    long_description { Faker::Lorem.words(rand(30)+1).join(" ") }
    status {"Open"}
    user_id {1}

    trait :with_closed_status do
      after :create do |ticket|
        ticket.status = 'Closed'
        ticket.save!
      end
    end

    trait :with_user do
      after :create do |ticket, evaluator|
        ticket.user_id = evaluator.user.id
        ticket.save!
      end
    end

    trait :with_worker do
      after :create do |ticket, evaluator|
        ticket.worker_id = evaluator.user.id
        ticket.save!
      end
    end

    factory :closed_ticket, traits: [:with_closed_status]
    factory :closed_ticket_with_user, traits: [:with_closed_status, :with_user]
    factory :closed_ticket_with_worker, traits: [:with_closed_status, :with_worker]
    # trait :with_support_role do
    #   after :create do |user|
    #     user.support = true
    #     user.save!
    #   end
    # end
    #
    # factory :support, traits: [:with_support_role]

  end
end