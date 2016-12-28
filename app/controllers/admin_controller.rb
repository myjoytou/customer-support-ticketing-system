class AdminController < ApplicationController
  respond_to :json, :pdf
  before_action :check_admin_user

  def index
  end

  def get_all_users
    user = User.all
    respond_with({data: user, status: @@status[:success], error_message: ''}, location: '/')
  end

  def activate_user
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.activate
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def deactivate_user
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.deactivate
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def assign_support_role
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.assign_role(:support)
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def deny_support_role
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.deny_role(:support)
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def assign_admin_role
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.assign_role(:admin)
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def deny_admin_role
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.deny_role(:admin)
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def process_pending_tickets
    validate_params_for_ticket
    ticket = Ticket.open_tickets.where(id: params[:ticket_id]).first if Ticket.open_tickets.present?
    raise "Ticket not present" if ticket.blank?
    ticket.process_ticket params[:status], current_user
    respond_with({data: ticket, status: @@status[:success], error_message: ''}, location: '/')
  end

  def get_pending_tickets
    pending_tickets = Ticket.open_tickets
    respond_with({data: pending_tickets, status: @@status[:success], error_message: ''}, location: '/')
  end

  def get_closed_tickets
    closed_tickets = Ticket.closed_tickets
    respond_with({data: closed_tickets, status: @@status[:success], error_message: ''}, location: '/')
  end

  def get_closed_tickets_report
    @closed_tickets = Ticket.closed_tickets.where("created_at >= '#{Time.now - 1.month}'")
    raise "No closed ticket in past month!" if @closed_tickets.blank?
    respond_to do |format|
      format.html
      format.json
      format.pdf do
        pdf = ClosedTicketPdf.new(@closed_tickets)
        filename = File.join(Rails.root, "app/pdfs", "ClosedTicketReportAdmin.pdf")
        pdf.render_file filename
        send_file filename, filename: "ClosedTicketReportAdmin.pdf", type: "application/pdf"
      end
    end
  end

  private

  def validate_params_for_ticket
    raise "Ticket id not present!" if params[:ticket_id].blank?
    raise "Status not present!" if params[:status].blank?
  end

  def validate_params
    raise "User id not present!" if params[:user_id].blank?
  end

  def check_admin_user
    raise "Not Authorised!" if current_user.admin?.blank?
  end
end
