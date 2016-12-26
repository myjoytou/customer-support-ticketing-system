require 'prawn'
class ClosedTicketPdf < Prawn::Document
  def initialize(closed_tickets)
    super(top_margin: 70)
    @closed_tickets = closed_tickets
    table format_ticket(@closed_tickets), header: true, column_widths: [30, 45, 50, 100, 100, 45, 45, 60, 60], cell_style: { font: "Times-Roman", size: 12 }
  end

  def format_ticket(ticket)
    final_array = []
    final_array << Ticket.column_names
    ticket.each do |t|
      temp_array = []
      Ticket.column_names.each do |field|
        temp_array << t[field].to_s
      end
      final_array << temp_array
    end
    puts "=============== the final array is===== #{final_array} "
    final_array
  end
end