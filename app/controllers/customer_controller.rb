class CustomerController < ApplicationController
  respond_to :json

  def get_previous_tickets
    tickets = current_user.tickets
    respond_with({data: tickets, status: @@status[:success], error_message: ''}, location: '/')
  end

  def create_new_ticket
    validate_params params
    Ticket.create_support_ticket(params, current_user)
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  private
  def validate_params(params)
    raise "Name should be present!" if params[:name].blank?
  end
end
