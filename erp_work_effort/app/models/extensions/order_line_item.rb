OrderLineItem.class_eval do

  has_many :candidate_submissions, :dependent => :destroy

end
