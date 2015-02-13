class ProductFeature < ActiveRecord::Base
  attr_accessible :custom_fields, :product_feature_type_id, :product_feature_value_id
  belongs_to :product_feature_type
  belongs_to :product_feature_value
  # start self reference
  has_many   :product_feature_interactions, dependent: :destroy
  has_many   :interacted_product_features, through: :product_feature_interactions
  has_many   :product_features, through: :product_feature_interactions
  # end self reference
  has_many :product_feature_applicabilities, dependent: :destroy

  def feature_of_records
    product_feature_applicabilities.map { |o| o.feature_of_record_type.constantize.find(o.feature_of_record_id) }
  end

  is_json :custom_fields

  def self.get_feature_types(product_features)
    array = []
    already_filtered_product_features = if product_features
                                          product_features.map {|pf| pf.product_feature_type}
                                        else
                                          []
                                        end
    ProductFeatureType.each_with_level(ProductFeatureType.root.self_and_descendants) do |o, level|
      if !already_filtered_product_features.include?(o) && level != 0
        array << {feature_type:o,parent_id:o.parent_id,level:level}
      end
    end

    block_given? ? yield(array) : array
  end

  def self.get_values(feature_type,product_features=[])
    feature_value_ids = feature_type.product_feature_values.pluck(:id)
    valid_feature_value_ids = feature_value_ids.uniq
    # check each possible feature type / feature value combination for the given feature_type
    feature_value_ids.each do |value_id|

      # Is there a product feature to support this feature type / feature value combination?
      test_product_feature = ProductFeature.where(product_features:{product_feature_type_id:feature_type.id,product_feature_value_id:value_id}).last
      valid_feature_value_ids -= [value_id] unless test_product_feature
      next unless test_product_feature

      # Are all of the dependencies of this product feature in the given product_features?
      deps = {}
      test_product_feature.dependent_interactions.each do |dependency|
        deps[dependency.interacted_product_feature.product_feature_type_id] ||= ['all']
        deps[dependency.interacted_product_feature.product_feature_type_id] << dependency.interacted_product_feature.product_feature_value_id
      end
      deps.each do |depends_on_feature_type_id_n, acceptable_value_ids_for_n|
        has_dependency = product_features.detect do |pf|
          pf[:product_feature_type_id].to_i == depends_on_feature_type_id_n && acceptable_value_ids_for_n.include?(pf[:product_feature_value_id].to_i)
        end
        valid_feature_value_ids -= [value_id] unless has_dependency
      end

      # Are none of the invalidators of this product feature in the given product_features?
      test_product_feature.invalid_interactions.each do |interaction|
        has_invalidator = product_features.detect do |pf|
          pf[:product_feature_type_id] == interaction.interacted_product_feature.product_feature_type_id && pf[:product_feature_value_id] == interaction.interacted_product_feature.product_feature_value_id
        end
        valid_feature_value_ids -= [value_id] if has_invalidator
      end

    end
    valid_feature_value_ids.uniq
  end

  def method_missing(name, *args)
    if name.match(/_interactions$/)
      self.class.class_eval do
        define_method(name) do
          self.product_feature_interactions.
              includes(:product_feature_interaction_type).
              where(product_feature_interaction_types:{internal_identifier:"#{name.to_s.downcase.gsub('_interactions','')}"})
        end
      end
      send(name)
    else
      super
    end
  end
end
