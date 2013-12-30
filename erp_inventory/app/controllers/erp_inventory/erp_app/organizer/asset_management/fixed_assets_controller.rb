module ErpApp
  module Organizer
    module AssetManagement
      class FixedAssetsController < ::ErpApp::Organizer::BaseController

        def index

          fixed_assets = FixedAsset.all
          render :json => {:success => true, :fixed_assets => fixed_assets.collect { |fixed_asset| fixed_asset.to_hash(:only => [:id, :description, :created_at, :updated_at]) }}

        end

      end
    end
  end
end
