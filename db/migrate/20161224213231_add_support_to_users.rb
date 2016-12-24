class AddSupportToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :support, :boolean
  end
end
