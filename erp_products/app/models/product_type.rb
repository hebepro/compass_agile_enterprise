class ProductType < ActiveRecord::Base
  attr_protected :created_at, :updated_at

  acts_as_nested_set
  include ErpTechSvcs::Utils::DefaultNestedSetMethods
 
  has_file_assets
  is_describable
  
	belongs_to :product_type_record, :polymorphic => true  
  has_one    :product_instance
  belongs_to :unit_of_measurement
  has_many :product_type_pty_roles, :dependent => :destroy
  
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
  
end
