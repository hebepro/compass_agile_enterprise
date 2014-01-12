class SubscriptionAccount < ActiveRecord::Base
  acts_as_biz_txn_account

  belongs_to :subscription
end