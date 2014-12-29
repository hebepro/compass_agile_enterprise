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

  def self.without_offers(context={})
    product_types_tbl = arel_table
    product_offer_tbl = ProductOffer.arel_table
    simple_product_offers_tbl = SimpleProductOffer.arel_table

    valid_dates_sql = simple_product_offers_tbl.project(:product_type_id)
                          .join(product_offer_tbl).on(product_offer_tbl[:product_offer_record_id].eq(simple_product_offers_tbl[:id])
                                                          .and(product_offer_tbl[:product_offer_record_type].eq("SimpleProductOffer")))
                          .where(product_offer_tbl[:valid_from].eq(nil).or(product_offer_tbl[:valid_from].lt(Time.now.utc)
                                                                               .or(product_offer_tbl[:valid_to].gt(Time.now.utc))))

    statement = where(product_types_tbl[:id].not_in(simple_product_offers_tbl.project(:product_type_id))
                          .or(product_types_tbl[:id].not_in(valid_dates_sql)).to_sql)

    # apply category if it is in the context
    if context[:category_id]
      statement = statement.joins("inner join category_classifications on
                       category_classifications.classification_id = product_types.id and
                       category_classifications.classification_type = 'ProductType' ")
                      .where('category_classifications.category_id = ?', context[:category_id])
    end

    statement
  end

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
end
