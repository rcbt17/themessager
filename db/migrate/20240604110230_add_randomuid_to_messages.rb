class AddRandomuidToMessages < ActiveRecord::Migration[7.1]
  def change
    add_column :messages, :randomuid, :string
  end
end
