Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "home#index"
  get 'customers/get_previous_tickets', to: 'customer#get_previous_tickets'
  get 'supports/get_pending_tickets', to: 'support#get_pending_tickets'
  get 'supports/get_closed_tickets', to: 'support#get_closed_tickets'
  post 'supports/process_pending_tickets', to: 'support#process_pending_tickets'
end
