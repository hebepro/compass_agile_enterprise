# create_table :product_types do |t|
#   #these columns are required to support the behavior of the plugin 'better_nested_set'
#   #ALL products have the ability to act as packages in a nested set-type structure
#   #
#   #The package behavior is treated differently from other product_relationship behavior
#   #which is implemented using a standard relationship structure.
#   #
#   #This is to allow quick construction of highly nested product types.
#   t.column  	:parent_id,    :integer
#   t.column  	:lft,          :integer
#   t.column  	:rgt,          :integer
#
#   #custom columns go here
#   t.column  :description,                 :string
#   t.column  :product_type_record_id,      :integer
#   t.column  :product_type_record_type,    :string
#   t.column 	:external_identifier, 	      :string
#   t.column  :internal_identifier,         :string
#   t.column 	:external_id_source, 	        :string
#   t.column  :default_image_url,           :string
#   t.column  :list_view_image_id,          :integer
#   t.timestamps
# end

class ProductType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
  acts_as_taggable

  has_file_assets
  is_describable

  is_json :custom_fields

  belongs_to :product_type_record, polymorphic: true
  has_one :product_instance
  belongs_to :unit_of_measurement
  has_many :product_type_pty_roles, dependent: :destroy
  has_many :simple_product_offers, dependent: :destroy
  has_many :product_feature_applicabilities, as: :feature_of_record


  def prod_type_relns_to
    ProdTypeReln.where('prod_type_id_to = ?', id)
  end

  def prod_type_relns_from
    ProdTypeReln.where('prod_type_id_from = ?', id)
  end

  def to_label
    "#{description}"
  end

  def to_s
    "#{description}"
  end

  def self.count_by_status(product_type, prod_availability_status_type)
    ProductInstance.count("product_type_id = #{product_type.id} and prod_availability_status_type_id = #{prod_availability_status_type.id}")
  end

  def images_path
    file_support = ErpTechSvcs::FileSupport::Base.new(:storage => Rails.application.config.erp_tech_svcs.file_storage)
    File.join(file_support.root, Rails.application.config.erp_tech_svcs.file_assets_location, 'products', 'images', "#{self.description.underscore}_#{self.id}")
  end

  def to_data_hash
    {
        :id => self.id,
        :description => self.description,
        :sku => self.sku,
        :unit_of_measurement_id => self.unit_of_measurement_id,
        :unit_of_measurement_description => (self.unit_of_measurement.description rescue nil),
        :comment => self.comment,
        :created_at => self.created_at,
        :updated_at => self.updated_at
    }
  end

  def to_display_hash
    {
        id: id,
        description: description,
        offer_list_description: find_descriptions_by_view_type('list_description').first.try(:description),
        offer_short_description: find_descriptions_by_view_type('short_description').first.try(:description),
        offer_long_description: find_descriptions_by_view_type('long_description').first.try(:description),
        offer_base_price: get_current_simple_amount_with_currency,
        images: images.pluck(:id)
    }
  end
end

module Arel
  class SelectManager
    def polymorphic_join(hash={polytable:nil, table:nil, model: nil, polymodel:nil, record_type_name:nil, record_id_name:nil, table_model:nil})
      # Left Outer Join with 2 possible hash argument sets:
      #   1) model (AR model), polymodel (AR model), record_type_name (symbol), record_id_name (symbol)
      #   2) polytable (arel_table), table (arel_table), record_type_name (symbol), record_id_name (symbol), table_model (string)

      if hash[:model] && hash[:polymodel]
        self.join(hash[:polymodel].arel_table, Arel::Nodes::OuterJoin).on(hash[:polymodel].arel_table[hash[:record_id_name]].eq(hash[:model].arel_table[:id]).and(hash[:polymodel].arel_table[hash[:record_type_name]].eq(hash[:model].to_s)))
      elsif hash[:polytable] && hash[:record_type_name]
        self.join(hash[:polytable], Arel::Nodes::OuterJoin).on(hash[:polytable][hash[:record_id_name]].eq(hash[:table][:id]).and(hash[:polytable][hash[:record_type_name]].eq(hash[:table_model])))
      else
        raise 'Invalid Args'
      end
    end
  end
end