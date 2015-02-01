class ChangeOrderNumberToString < ActiveRecord::Migration
  def up
    change_column :order_txns, :order_number, :string
  end

  def down
    change_column :order_txns, :order_number, :integer
  end
end
