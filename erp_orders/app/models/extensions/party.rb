Party.class_eval do
  has_many :order_line_item_pty_roles

  def orders(statuses=[])
    statement = OrderTxn

    unless statuses.empty?
      statement = statement.with_current_status({'order_statuses' => statuses})
    end

    statement.joins(:biz_txn_event => :biz_txn_event_party_roles)
            .where(:biz_txn_event_party_roles => {:party_id => self.id})

    statement
  end
end
