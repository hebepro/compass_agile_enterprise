namespace :resume_parser do
	desc "Populate Model data for all pending resumes"
	task :populate_model_data => :environment do
		pending_resumes = Resume.with_current_status
														.where('tracked_status_type_id = ?',
															TrackedStatusType.find_by_ancestor_iids(['resume_parser', 'pending']))
														.readonly(false)
		pending_resumes_count = pending_resumes.count
		if pending_resumes_count == 0
			puts "No pending resumes to be populated"
		else
			pending_resumes.each_with_index do |pending_resume,index|
				puts "Populating model data: #{index+1} out of #{pending_resumes_count}"
				pending_resume.populate_model_data
				puts "#{index+1} out of #{pending_resumes_count} #{"resume".pluralize(pending_resumes_count)} populated"
			end
		end
	end
end