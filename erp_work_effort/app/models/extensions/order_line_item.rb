OrderLineItem.class_eval do

  has_many :candidate_submissions, :dependent => :destroy


  before_destroy :destroy_candidate_submissions

  def destroy_candidate_submissions
    self.candidate_submissions.destroy_all
  end

end
