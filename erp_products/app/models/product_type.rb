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
  
	belongs_to :product_type_record, :polymorphic => true  
  has_one    :product_instance
  belongs_to :unit_of_measurement
  has_many :product_type_pty_roles, :dependent => :destroy
  has_one :simple_product_offer, dependent: :destroy
  
  def prod_type_relns_to
    ProdTypeReln.where('prod_type_id_to = ?',id)
  end

  def prod_type_relns_from
    ProdTypeReln.where('prod_type_id_from = ?',id)
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
    File.join(file_support.root,Rails.application.config.erp_tech_svcs.file_assets_location,'products','images',"#{self.description.underscore}_#{self.id}")
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

  def self.without_offers(ctx)
    #TODO: implement context
    arr = self.all.select do |pt|
      self.no_valid_offer?(pt)
    end
    self.where(id: arr.map(&:id))
  end

  def self.no_valid_offer?(pt)
    pt.simple_product_offer == nil || ( !pt.simple_product_offer.product_offer.valid_from || pt.simple_product_offer.product_offer.valid_from > Time.now ) || ( !pt.simple_product_offer.product_offer.valid_to || pt.simple_product_offer.product_offer.valid_to < Time.now )
  end
end
