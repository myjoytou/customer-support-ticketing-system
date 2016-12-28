class AddWorkerIdToTicket < ActiveRecord::Migration[5.0]
  def change
    add_column :tickets, :worker_id, :integer, index: true, default: nil
  end
end
