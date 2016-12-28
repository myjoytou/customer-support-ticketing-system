Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root :to => 'admin#index', :constraints => RoleConstraint.new(:admin)
  root :to => 'support#index', :constraints => RoleConstraint.new(:support)
  root to: "home#index"
  get 'support' , to: 'support#index'
  get 'admin', to: 'admin#index'
  get 'customers/get_previous_tickets', to: 'customer#get_previous_tickets'
  get 'supports/get_pending_tickets', to: 'support#get_pending_tickets'
  get 'supports/get_closed_tickets_report', to: 'support#get_closed_tickets_report'
  get 'admins/get_all_users', to: 'admin#get_all_users'
  get 'admins/get_pending_tickets', to: 'admin#get_pending_tickets'
  get 'admins/get_closed_tickets', to: 'admin#get_closed_tickets'
  get 'admins/get_closed_tickets_report', to: 'admin#get_closed_tickets_report'
  post 'supports/process_pending_tickets', to: 'support#process_pending_tickets'
  post 'customers/create_new_ticket', to: 'customer#create_new_ticket'
  post 'admins/deactivate_user', to: 'admin#deactivate_user'
  post 'admins/activate_user', to: 'admin#activate_user'
  post 'admins/assign_support_role', to: 'admin#assign_support_role'
  post 'admins/assign_admin_role', to: 'admin#assign_admin_role'
  post 'admins/deny_admin_role', to: 'admin#deny_admin_role'
  post 'admins/deny_support_role', to: 'admin#deny_support_role'
  post 'admins/process_pending_tickets', to: 'admin#process_pending_tickets'
end
