class AddOrderTrackedStatues
  
  def self.up
    order_statuses = TrackedStatusType.create(internal_identifier: 'order_statuses', description: 'Order Statuses')

    [
        ['initialized', 'Initialized'],
        ['items_added', 'Items Added'],
        ['demographics_gathered', 'Demographics Gathered'],
        ['payment_failed', 'Payment Failed'],
        ['paid', 'Paid'],
        ['ready_to_ship', 'Ready To Ship'],
        ['shipped', 'Shipped'],
    ].each do |data|
      status = TrackedStatusType.create(internal_identifier: data[0], description: data[1])
      status.move_to_child_of(order_statuses)
    end

  end
  
  def self.down
    TrackedStatusType.find_by_internal_identifier('order_statuses').destroy
  end

end
