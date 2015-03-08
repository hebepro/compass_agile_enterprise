module Api
  module V1
    class PartiesController < BaseController

      def index
        query = params[:query]
        sort_hash = params[:sort].blank? ? {} : Hash.symbolize_keys(JSON.parse(params[:sort]).first)
        sort = sort_hash[:property] || 'username'
        dir = sort_hash[:direction] || 'ASC'
        limit = params[:limit] || 25
        start = params[:start] || 0

        if query.blank?
          parties = Party.order("#{sort} #{dir}").offset(start).limit(limit)
          total_count = parties.count
        else
          parties = Party.where('description like ?', "%#{query}%").order("#{sort} #{dir}")
          total_count = parties.count
          parties = parties.offset(start).limit(limit)
        end

        render :json => {total_count: total_count, parties: parties.collect(&:to_data_hash)}
      end

      def show
        party = Party.find(params[:id])

        render :json => {party: party.to_data_hash}
      end

    end # PartiesController
  end # V1
end # Api