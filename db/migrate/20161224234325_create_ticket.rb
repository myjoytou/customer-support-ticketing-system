class CreateTicket < ActiveRecord::Migration[5.0]
  def change
    create_table :tickets do |t|
      t.belongs_to :user, index: true
      t.string :name, null: false
      t.text :short_description
      t.text :long_description
      t.string :image_url
      t.string :status, null: false
    end
  end
end
