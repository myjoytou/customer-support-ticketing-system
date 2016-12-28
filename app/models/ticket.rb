class Ticket < ApplicationRecord
  belongs_to :user
  validates :name, presence: true
  validates :user_id, presence: true
  validates :status, presence: true

  @@possible_status = {
      open: "Open",
      processing: "Processing",
      closed: "Closed"
  }.freeze
  cattr_reader :possible_status

  scope :open_tickets, -> { where(status: Ticket.possible_status[:open]) }
  scope :processing, -> { where(status: Ticket.possible_status[:processing]) }
  scope :closed_tickets, -> { where(status: Ticket.possible_status[:closed]) }

  def self.create_support_ticket(params, current_user)
    ticket = Ticket.new
    ticket.name = params[:name]
    ticket.short_description = params[:short_description]
    ticket.long_description = params[:long_description]
    ticket.status = Ticket.possible_status[:open]
    ticket.user_id = current_user.id
    ticket.save!
  end

  def process_ticket(status, current_user)
    self.status = status
    self.worker_id = current_user.id
    self.save!
  end

end
