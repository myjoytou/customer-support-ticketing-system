class AdminController < ApplicationController
  respond_to :json, :pdf
  before_action :check_admin_user

  def index
  end

  def get_all_users
    respond_with({data: User.all, status: @@status[:success], error_message: ''}, location: '/')
  end

  def deactivate_user
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.deactivate
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def activate_user
    validate_params
    user = User.where(id: params[:user_id]).first
    raise "User not present!" if user.blank?
    user.activate
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def process_pending_tickets
    validate_params
    ticket = Ticket.open_tickets.where(params[:ticket_id].to_s).first if Ticket.open_tickets.present?
    raise "Ticket not present" if ticket.blank?
    ticket.process_ticket params[:status], current_user
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
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
  def validate_params
    raise "User id not present!" if params[:user_id].blank?
  end

  def check_admin_user
    raise "Not Authorised!" if current_user.admin?.blank?
  end
end
