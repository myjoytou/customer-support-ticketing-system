class SupportController < ApplicationController
  respond_to :json, :pdf
  before_action :check_support_user

  def index

  end

  def get_pending_tickets
    tickets = Ticket.open_tickets.where(worker_id: nil)
    respond_with({data: tickets, status: @@status[:success], error_message: ''}, location: '/')
  end

  def process_pending_tickets
    validate_params
    ticket = Ticket.open_tickets.where(id: params[:ticket_id]).first if Ticket.open_tickets.present?
    raise "Ticket not present" if ticket.blank?
    ticket.process_ticket params[:status], current_user
    respond_with({data: '', status: @@status[:success], error_message: ''}, location: '/')
  end

  def get_closed_tickets_report
    @closed_tickets = Ticket.closed_tickets.where("created_at >= '#{Time.now - 1.month}' and worker_id = #{current_user.id}")
    raise "No closed ticket in past month!" if @closed_tickets.blank?
    cookies['fileDownload'] = 'true'
    respond_to do |format|
      format.html
      format.json
      format.pdf do
        pdf = ClosedTicketPdf.new(@closed_tickets)
        filename = File.join(Rails.root, "app/pdfs", "ClosedTicketReport.pdf")
        pdf.render_file filename
        send_file filename, filename: "ClosedTicketReport.pdf", type: "application/pdf"
      end
    end
  end

  private
  def validate_params
    raise "Ticket id not present" if params[:ticket_id].blank?
    raise "Status not present" if params[:status].blank?
  end
  def check_support_user
    raise "Not Authorised!" if !current_user.support?
  end
end
