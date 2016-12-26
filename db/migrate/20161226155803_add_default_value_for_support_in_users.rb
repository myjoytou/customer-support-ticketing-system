class AddDefaultValueForSupportInUsers < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :support, :boolean, default: false
  end
end
