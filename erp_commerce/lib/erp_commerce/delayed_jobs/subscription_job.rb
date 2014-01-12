require 'benchmark'

module ErpCommerce
  module DelayedJobs
    class SubscriptionJob < BaseJob

      def initialize
        @logger = Logger.new("log/#{Rails.env}-subscriptions_job.log", "weekly")
        @logger.level = Logger::INFO
        @priority = 1
      end

      def perform

        time = Benchmark.measure do
          begin

            Subscription.where('next_invoice_date = ?', Date.today).each do |subscription|

            end

            Subscription.where('next_charge_date = ?', Date.today).each do |subscription|

            end

          rescue Exception => ex
            @logger.error("#{Time.now}**************************************************")
            @logger.error("Error: #{ex.message}")
            @logger.error("Trace: #{ex.backtrace}")
            @logger.error("*************************************************************")
          end
        end

        start_time = Chronic.parse(DriverBuddy::NOTIFICATIONS_DELAY)
        Delayed::Job.enqueue(ErpCommerce::DelayedJobs::SubscriptionJob.new, @priority, start_time)

        #update job tracker
        JobTracker.job_ran('Subscription Job', self.class.name, ("(%.4fs)" % time.real), start_time)
      end

      def self.schedule_job(schedule_at)
        Delayed::Job.enqueue(ErpCommerce::DelayedJobs::SubscriptionJob.new, @priority, schedule_at)
      end

    end #SubscriptionJob
  end #DelayedJobs
end #ErpCommerce